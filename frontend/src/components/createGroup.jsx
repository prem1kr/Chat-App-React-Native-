import React from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";

export default function CreateGroupModal({ visible, onClose, groupName, setGroupName, groupImage, setGroupImage, onCreate }) {

  return (
    <Modal visible={visible} transparent animationType="slide" >
      <View style={styles.modalOverlay}>

        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}> Create Group  </Text>
          <TextInput placeholder="Group Name" value={groupName} onChangeText={setGroupName} style={styles.modalInput} />
          <TextInput placeholder="Group Image URL (optional)" value={groupImage} onChangeText={setGroupImage} style={styles.modalInput} />

          {groupImage ? (<Image source={{ uri: groupImage }} style={styles.previewImage} />) : null}

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} >
              <Text style={styles.btnText}>  Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.createBtn} onPress={onCreate} >
              <Text style={styles.btnText}> Create  </Text>
            </TouchableOpacity>
          </View>

        </View>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  modalContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 20,
  },

  modalInput: {
    height: 52,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 14,
    backgroundColor: "#F9FAFB",
    color: "#111827",
  },

  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 15,
    alignSelf: "center",
    marginVertical: 15,
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  cancelBtn: {
    flex: 1,
    height: 50,
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  createBtn: {
    flex: 1,
    height: 50,
    backgroundColor: "#4ec28d",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  btnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});