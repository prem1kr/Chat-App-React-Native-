import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import LoadingButton from '../../../components/loadingButton';
import { addEditProfile, getProfile } from '../../../hooks/useProfile';
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppHeader from '../../../components/appHeader';
import { useDispatch, useSelector } from "react-redux";
import { setProfile, setUpdateProfile } from "../../../redux/slices/profileSlice";

const EditProfile = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const user = useSelector(state => state.user.user || []);
    const [userId, setUserId] = useState("");
    const profile = useSelector(state => state.profile.profile || []);

    const [form, setForm] = useState({
        userId: user?._id || "",
        name: "",
        email: "",
        phone: " ",
        address: "",
        bio: "",
        profileImage: "",
    });

    useEffect(() => {
        setForm({
            userId: user?._id || profile?._userId || "",
            name: user?.name || profile?.name || "",
            email: user?.email || profile?.email || "",
            phone: profile?.phone || "",
            address: profile?.address || "",
            bio: profile?.bio || "",
            profileImage: profile?.profileImage || "",
        });
    }, [user, userId]);

    const handleChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const response = await addEditProfile(form);
            if (response?.success) {
                dispatch(setUpdateProfile(response.profile));
                Alert.alert("success", response.message);
            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProfile = async () => {
        const res = await getProfile(user?._id);
        if (res?.success) {
            dispatch(setProfile(res.profile));
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <>
            <AppHeader title="Profile"  >
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
            </AppHeader>

            <ScrollView style={styles.container}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">

                        <View style={styles.imageContainer}>
                            <Image source={{ uri: form.profileImage || "https://i.pravatar.cc/150?img=12", }} style={styles.profileImage} />
                            <TouchableOpacity style={styles.editIcon}>
                                <Ionicons name="camera" size={18} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.form}>
                            <Text style={styles.sectionTitle}>Personal Info</Text>
                            <TextInput placeholder="Full Name" style={styles.input} value={form.name} onChangeText={(text) => handleChange('name', text)} />
                            <TextInput placeholder="Email" style={[styles.input, styles.disabledInput]} keyboardType="email-address" value={form.email} onChangeText={(text) => handleChange('email', text)} editable={false} />
                            <TextInput placeholder="Phone Number" style={styles.input} keyboardType="phone-pad" value={form.phone} onChangeText={(text) => handleChange('phone', text)} />
                            <TextInput placeholder="Address" style={styles.input} value={form.address} onChangeText={(text) => handleChange('address', text)} />
                            <Text style={styles.sectionTitle}>About You</Text>
                            <TextInput placeholder="write your bio" style={[styles.input, styles.bioInput]} value={form.bio} onChangeText={(text) => handleChange('bio', text)} multiline textAlignVertical="top" maxLength={200} />
                            <LoadingButton title={'Update Profile'} loading={loading} style={styles.saveBtn} onPress={handleSave} />
                        </View>

                    </ScrollView>
                </KeyboardAvoidingView >

            </ScrollView>
        </>
    );
};

export default EditProfile;

const styles = StyleSheet.create({
    header: {
        height: 70,
        backgroundColor: '#4ec28d',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingTop: 20,
        borderBottomRightRadius: 20,
        borderTopLeftRadius: 20,
    },

    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginLeft: 85,
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',

    },
    content: {
        flex: 1,
        paddingLeft: 8,
        paddingRight: 8

    },

    imageContainer: {
        alignItems: 'center',
        marginTop: 30,
    },

    profileImage: {
        width: 110,
        height: 110,
        borderRadius: 60,
    },

    editIcon: {
        position: 'absolute',
        bottom: 5,
        right: 130,
        backgroundColor: '#4ec28d',
        padding: 6,
        borderRadius: 20,
    },

    form: {
        padding: 20,

    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 10,
    },

    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#eee',
        color: 'black',
    },

    saveBtn: {
        backgroundColor: '#4ec28d',
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },

    saveText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    disabledInput: {
        backgroundColor: '#eaeaea',
        color: '#777',
    },
    bioInput: {
        height: 120,
        paddingTop: 12,
    },

});