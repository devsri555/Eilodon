import { router } from "expo-router";
import { useState } from "react";
import {
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { SafeAreaView } from "react-native-safe-area-context";

const QUESTIONS = [
  { key: "q1", label: "Who do you believe you are?" },
  { key: "q2", label: "What do you value?" },
  { key: "q3", label: "How do you think you use your time?" },
  { key: "q4", label: "What kind of worker do you consider yourself to be?" },
  { key: "q5", label: "When are you most focused?" },
];

export default function HomeScreen() {
  const db = useSQLiteContext();
  const [answers, setAnswers] = useState<Record<string, string>>({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const submitQuestionnaire = async () => {
    await db.runAsync(
      "INSERT INTO questionnaire_answers (question_id, answer_text) VALUES (?, ?), (?, ?), (?, ?), (?, ?), (?, ?)",
      [
        1,
        answers.q1,
        2,
        answers.q2,
        3,
        answers.q3,
        4,
        answers.q4,
        5,
        answers.q5,
      ],
    );
    setSubmitted(true);
  };

  // The correct placement for the submitted check is here, inside the component
  if (submitted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.confirmContainer}>
          <Text style={styles.confirmGlyph}>◈</Text>
          <Text style={styles.confirmTitle}>Declaration Recorded</Text>
          <Text style={styles.confirmSub}>
            Your self-image has been noted.{"\n"}The week will now speak for
            itself.
          </Text>

          <TouchableOpacity
            style={[styles.submitBtn, { marginTop: 40 }]}
            onPress={() => router.push('/report')}
            activeOpacity={0.8}
          >
            <Text style={styles.submitText}>VIEW REPORT</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>WEEKLY DECLARATION</Text>
          <Text style={styles.subtitle}>
            Answer honestly. The record does not care what you intended.
          </Text>
        </View>

        {QUESTIONS.map((q, i) => (
          <View key={q.key} style={styles.questionBlock}>
            <View style={styles.questionHeader}>
              <Text style={styles.questionNumber}>
                {String(i + 1).padStart(2, "0")}
              </Text>
              <Text style={styles.questionLabel}>{q.label}</Text>
            </View>

            <TextInput
              style={[styles.input, focused === q.key && styles.inputFocused]}
              onFocus={() => setFocused(q.key)}
              onBlur={() => setFocused(null)}
              onChangeText={(t) => setAnswers({ ...answers, [q.key]: t })}
              value={answers[q.key]}
              multiline
              textAlignVertical="top"
            />
          </View>
        ))}

        <TouchableOpacity
          style={[
            styles.submitBtn,
            Object.values(answers).some(Boolean) && styles.submitBtnActive,
          ]}
          onPress={submitQuestionnaire}
          activeOpacity={0.8}
        >
          <Text style={styles.submitText}>SUBMIT DECLARATION</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>All data is stored locally</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f2e4",
  },
  scroll: {
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 60,
  },
  header: {
    marginBottom: 28,
  },
  eyebrow: {
    fontSize: 30,
    letterSpacing: 2,
    color: "#3F6A5E",
    fontFamily: "GoogleSansBold",
    marginBottom: 0,
  },
  subtitle: {
    fontSize: 13,
    color: "#76B7A6",
    fontFamily: "GoogleSansItalic",
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#1E1E1E",
    marginBottom: 32,
  },
  questionBlock: {
    marginBottom: 32,
  },
  questionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 12,
  },
  questionNumber: {
    fontSize: 16,
    color: "#3a9a5b",
    fontFamily: "GoogleSans",
  },
  questionLabel: {
    flex: 1,
    fontSize: 20,
    color: "#4cae73",
    fontFamily: "GoogleSans",
    lineHeight: 24,
  },
  input: {
    backgroundColor: "#d1e7d5",
    includeFontPadding: false,
    borderWidth: 1,
    borderColor: "#d1e7d5",
    borderRadius: 12,
    color: "#1f6b38",
    fontFamily: "GoogleSans",
    fontSize: 15,
    paddingVertical: 16,
    paddingHorizontal: 16,
    minHeight: 100,
    lineHeight: 22,
  },
  // input: {
  // backgroundColor: "#d1e7d5",
  // borderWidth: 1,
  // borderColor: "#d1e7d5",
  // borderRadius: 12,
  // fontSize: 15,
  // lineHeight: 18, // try 18-20
  // color: "#1f6b38",
  // paddingVertical: 16,
  // paddingHorizontal: 16,
  // minHeight: 100,
  // textAlignVertical: "top",
  // fontFamily: "GoogleSans",
  // },
  inputFocused: {
    borderColor: "#a3d3b5",
  },
  submitBtn: {
    width: 250,
    alignSelf: "center",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#1f6b38",
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: "center",
    backgroundColor: "#1f6b38",
  },
  submitBtnActive: {
    width: 250,
    alignSelf: "center",
    borderRadius: 999,
    borderColor: "#a3d3b5",
    backgroundColor: "#a3d3b5",
  },
  submitText: {
    fontSize: 11,
    fontFamily: "GoogleSansBold",
    letterSpacing: 3,
    color: "#050505",
  },
  footer: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 11,
    fontFamily: "GoogleSans",
    color: "#2E2E2E",
    letterSpacing: 1,
  },
  confirmContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  confirmGlyph: {
    fontSize: 32,
    color: "#C9A84C",
    marginBottom: 24,
  },
  confirmTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f6b38",
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  confirmSub: {
    fontSize: 14,
    color: "#6B6B6B",
    textAlign: "center",
    lineHeight: 22,
    fontStyle: "italic",
  },
});