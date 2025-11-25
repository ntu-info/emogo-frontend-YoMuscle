import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { addRecord } from "../utils/storage";

// 心情選項
const MOODS = [
  { emoji: "😄", label: "開心", value: "happy" },
  { emoji: "😊", label: "平靜", value: "calm" },
  { emoji: "😐", label: "普通", value: "neutral" },
  { emoji: "😔", label: "低落", value: "sad" },
  { emoji: "😤", label: "生氣", value: "angry" },
  { emoji: "😰", label: "焦慮", value: "anxious" },
];

export default function RecordScreen() {
  const [memo, setMemo] = useState("");
  const [selectedMood, setSelectedMood] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);

  // 取得 GPS 位置
  const getLocation = async () => {
    setLocationLoading(true);
    try {
      // Web 使用瀏覽器 API
      if (Platform.OS === "web") {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
              setLocationLoading(false);
            },
            (err) => {
              Alert.alert("錯誤", "無法取得位置: " + err.message);
              setLocationLoading(false);
            }
          );
        } else {
          Alert.alert("錯誤", "瀏覽器不支援定位功能");
          setLocationLoading(false);
        }
        return;
      }

      // Native 使用 expo-location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("權限不足", "請允許使用定位功能");
        setLocationLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    } catch (error) {
      console.error("Location error:", error);
      Alert.alert("錯誤", "無法取得位置");
    } finally {
      setLocationLoading(false);
    }
  };

  // 開啟相機（目前是 placeholder）
  const openCamera = () => {
    // TODO: 實作相機功能
    Alert.alert("相機功能", "相機錄影功能開發中...");
    setHasVideo(true); // 模擬已錄影
  };

  // 儲存記錄
  const saveRecord = async () => {
    if (!memo && !selectedMood && !location && !hasVideo) {
      Alert.alert("提示", "請至少填寫一項內容");
      return;
    }

    try {
      const record = {
        memo,
        mood: selectedMood,
        location,
        hasVideo,
      };

      await addRecord(record);

      Alert.alert("成功", "記錄已儲存！", [
        {
          text: "確定",
          onPress: () => {
            // 重置表單
            setMemo("");
            setSelectedMood(null);
            setLocation(null);
            setHasVideo(false);
          },
        },
      ]);
    } catch (error) {
      Alert.alert("錯誤", "儲存失敗: " + error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📝 新增記錄</Text>

      {/* 1. 影片區塊 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Ionicons name="videocam" size={20} color="#333" /> 錄製影片
        </Text>
        <TouchableOpacity
          style={[styles.videoButton, hasVideo && styles.videoButtonRecorded]}
          onPress={openCamera}
        >
          <Ionicons
            name={hasVideo ? "checkmark-circle" : "camera"}
            size={48}
            color={hasVideo ? "#4CAF50" : "#666"}
          />
          <Text style={styles.videoButtonText}>
            {hasVideo ? "已錄製影片 ✓" : "點擊開始錄影"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 2. Memo 區塊 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Ionicons name="create" size={20} color="#333" /> 記錄想法
        </Text>
        <TextInput
          style={styles.memoInput}
          placeholder="寫下你的想法..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          value={memo}
          onChangeText={setMemo}
        />
      </View>

      {/* 3. 心情區塊 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Ionicons name="happy" size={20} color="#333" /> 今天的心情
        </Text>
        <View style={styles.moodContainer}>
          {MOODS.map((mood) => (
            <TouchableOpacity
              key={mood.value}
              style={[
                styles.moodButton,
                selectedMood === mood.value && styles.moodButtonSelected,
              ]}
              onPress={() => setSelectedMood(mood.value)}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text
                style={[
                  styles.moodLabel,
                  selectedMood === mood.value && styles.moodLabelSelected,
                ]}
              >
                {mood.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 4. GPS 位置區塊 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Ionicons name="location" size={20} color="#333" /> GPS 定位
        </Text>
        <TouchableOpacity
          style={[styles.locationButton, location && styles.locationButtonActive]}
          onPress={getLocation}
          disabled={locationLoading}
        >
          <Ionicons
            name={location ? "checkmark-circle" : "navigate"}
            size={24}
            color={location ? "#4CAF50" : "#007AFF"}
          />
          <Text style={styles.locationButtonText}>
            {locationLoading
              ? "定位中..."
              : location
              ? `已定位 (${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)})`
              : "取得目前位置"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 儲存按鈕 */}
      <TouchableOpacity style={styles.saveButton} onPress={saveRecord}>
        <Ionicons name="save" size={24} color="#fff" />
        <Text style={styles.saveButtonText}>儲存記錄</Text>
      </TouchableOpacity>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
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
    marginBottom: 12,
    color: "#333",
  },
  // 影片相關樣式
  videoButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    padding: 30,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
  },
  videoButtonRecorded: {
    borderColor: "#4CAF50",
    borderStyle: "solid",
    backgroundColor: "#E8F5E9",
  },
  videoButtonText: {
    marginTop: 8,
    fontSize: 16,
    color: "#666",
  },
  // Memo 相關樣式
  memoInput: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  // 心情相關樣式
  moodContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  moodButton: {
    width: "30%",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  moodButtonSelected: {
    borderColor: "#007AFF",
    backgroundColor: "#E3F2FD",
  },
  moodEmoji: {
    fontSize: 32,
  },
  moodLabel: {
    marginTop: 4,
    fontSize: 14,
    color: "#666",
  },
  moodLabelSelected: {
    color: "#007AFF",
    fontWeight: "600",
  },
  // GPS 相關樣式
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 16,
  },
  locationButtonActive: {
    backgroundColor: "#E8F5E9",
  },
  locationButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  // 儲存按鈕
  saveButton: {
    flexDirection: "row",
    backgroundColor: "#007AFF",
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  bottomPadding: {
    height: 40,
  },
});
