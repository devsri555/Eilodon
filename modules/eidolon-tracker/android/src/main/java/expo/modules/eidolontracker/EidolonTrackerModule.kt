package expo.modules.eidolontracker

import android.app.AppOpsManager
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Process
import android.provider.Settings
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class EidolonTrackerModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("EidolonTracker")

    Function("hasPermission") {
      val context = appContext.reactContext ?: return@Function false
      val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
      val mode = appOps.checkOpNoThrow(
        AppOpsManager.OPSTR_GET_USAGE_STATS,
        Process.myUid(),
        context.packageName
      )
      return@Function mode == AppOpsManager.MODE_ALLOWED
    }

    Function("requestPermission") {
      val context = appContext.reactContext ?: return@Function null
      val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
      intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
      context.startActivity(intent)
      return@Function null
    }

    AsyncFunction("getScreenTime") {
      val context = appContext.reactContext ?: return@AsyncFunction emptyMap<String, Long>()
      val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
      val pm = context.packageManager
      
      val endTime = System.currentTimeMillis()
      val startTime = endTime - (1000 * 60 * 60 * 24) // 24 hours ago

      val stats = usageStatsManager.queryUsageStats(
        UsageStatsManager.INTERVAL_DAILY, 
        startTime, 
        endTime
      )

      val appUsage = mutableMapOf<String, Long>()
      
      for (stat in stats) {
        if (stat.totalTimeInForeground > 0) {
          // Translate to real app name
          val appName = try {
              val appInfo = pm.getApplicationInfo(stat.packageName, 0)
              pm.getApplicationLabel(appInfo).toString()
          } catch (e: Exception) {
              stat.packageName
          }
          
          val seconds = stat.totalTimeInForeground / 1000
          appUsage[appName] = (appUsage[appName] ?: 0L) + seconds
        }
      }
      
      return@AsyncFunction appUsage
    }
  }
}