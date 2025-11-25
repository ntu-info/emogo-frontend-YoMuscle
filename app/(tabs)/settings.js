import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { clearAllRecords } from "../utils/storage";

export default function SettingsScreen() {
  const handleClearData = () => {
    Alert.alert(
      "清除所有資料",
      "確定要刪除所有記錄嗎？此操作無法復原。",
      [
        { text: "取消", style: "cancel" },
        {
          text: "確定清除",
          style: "destructive",
          onPress: async () => {
            await clearAllRecords();
            Alert.alert("完成", "所有記錄已清除");
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>關於應用</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>應用名稱</Text>
          <Text style={styles.infoValue}>Emogo 情緒記錄</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>版本</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>功能說明</Text>
        
        <View style={styles.featureItem}>
          <Ionicons name="videocam" size={24} color="#007AFF" />
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>錄製影片</Text>
            <Text style={styles.featureDesc}>用影像記錄當下的時刻</Text>
          </View>
        </View>
        
        <View style={styles.featureItem}>
          <Ionicons name="create" size={24} color="#4CAF50" />
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>寫下想法</Text>
            <Text style={styles.featureDesc}>用文字記錄你的心情與想法</Text>
          </View>
        </View>
        
        <View style={styles.featureItem}>
          <Ionicons name="happy" size={24} color="#FFD700" />
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>記錄心情</Text>
            <Text style={styles.featureDesc}>選擇當下的情緒狀態</Text>
          </View>
        </View>
        
        <View style={styles.featureItem}>
          <Ionicons name="location" size={24} color="#FF6347" />
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>GPS 定位</Text>
            <Text style={styles.featureDesc}>記錄你所在的位置</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>資料管理</Text>
        
        <TouchableOpacity style={styles.dangerButton} onPress={handleClearData}>
          <Ionicons name="trash" size={20} color="#FF3B30" />
          <Text style={styles.dangerButtonText}>清除所有記錄</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with ❤️ by Emogo Team</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 16,
    color: "#666",
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  featureText: {
    marginLeft: 16,
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  featureDesc: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF0F0",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFD0D0",
  },
  dangerButtonText: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  footer: {
    padding: 32,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#999",
  },
});
