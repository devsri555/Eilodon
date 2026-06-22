import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Markdown from "react-native-markdown-display";
import { useSQLiteContext } from "expo-sqlite";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getScreenTime, hasPermission, requestPermission } from "../modules/eidolon-tracker/src/EidolonTrackerModule";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || "");

export default function ReportScreen() {
  const db = useSQLiteContext();
  const [reportText, setReportText] = useState("Checking the record...");
  const [needsPermission, setNeedsPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkData();
  }, []);

  const checkData = async () => {
    if (!hasPermission()) {
      setNeedsPermission(true);
      setLoading(false);
      setReportText("We cannot see the record.\n\nYou must grant **Usage Access** in your Android Settings to proceed.");
      return;
    }

    setNeedsPermission(false);
    setLoading(true);
    setReportText("Analyzing divergence...");
    
    try {
      // 1. Fetch Declaration & Reality
      const answers = await db.getAllAsync<{ question_id: number; answer_text: string }>(
        "SELECT question_id, answer_text FROM questionnaire_answers ORDER BY id DESC LIMIT 5"
      );
      const stats = await getScreenTime();
      
      // 2. Format Data for the AI
      let identityStr = answers.reverse().map(a => `- ${a.answer_text}`).join("\n");
      
      let usageStr = "";
      const sortedApps = Object.entries(stats).sort((a, b) => b[1] - a[1]).slice(0, 10);
      for (const [appName, seconds] of sortedApps) {
        const minutes = Math.floor(seconds / 60);
        if (minutes > 0) usageStr += `- ${appName}: ${minutes} minutes\n`;
      }

      // 3. The Prompt
      const prompt = `
        You are a cold, analytical AI evaluating human behavior. 
        Compare this user's stated identity against their actual screen time over the last 24 hours. 
        Write a short, biting, 3-paragraph divergence report. Be direct. Do not use pleasantries.
        
        Stated Identity:
        ${identityStr || "No identity declared."}
        
        Actual App Usage (Last 24h):
        ${usageStr || "No app usage recorded."}
      `;

      // 4. Call Gemini
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(prompt);
      
      setReportText(result.response.text());
    } catch (error) {
      setReportText("Error compiling the record. Ensure your API key is correct and you have internet access.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>THE RECORD</Text>
          <Text style={styles.subtitle}>Declaration vs. Behavior</Text>
        </View>
        <View style={styles.divider} />

        {needsPermission && (
          <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
            <Text style={styles.permissionText}>GRANT SYSTEM ACCESS</Text>
          </TouchableOpacity>
        )}

        <View style={styles.markdownContainer}>
          {loading && !needsPermission ? (
             <ActivityIndicator size="large" color="#1f6b38" style={{ marginTop: 40 }} />
          ) : (
             <Markdown style={markdownStyles}>{reportText}</Markdown>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f0f2e4" },
  scroll: { paddingHorizontal: 28, paddingTop: 32, paddingBottom: 60 },
  header: { marginBottom: 20 },
  eyebrow: { fontSize: 25, letterSpacing: 2, color: "#1f6b38", fontWeight: "bold" },
  subtitle: { fontSize: 14, color: "#3a9a5b", fontStyle: "italic", marginTop: 4 },
  divider: { height: 1, backgroundColor: "#a3d3b5", marginBottom: 24 },
  markdownContainer: { flex: 1 },
  permissionBtn: { backgroundColor: "#1f6b38", padding: 16, borderRadius: 8, alignItems: "center", marginBottom: 20 },
  permissionText: { color: "#fff", fontWeight: "bold", letterSpacing: 1 }
});

const markdownStyles = StyleSheet.create({
  body: { color: "#2E2E2E", fontSize: 16, lineHeight: 26 },
  strong: { fontWeight: "bold", color: "#111" },
});