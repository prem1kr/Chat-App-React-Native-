import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View } from 'react-native';

const LoadingButton = ({ title, onPress, loading, style, textStyle }) => {
    return (
        <TouchableOpacity style={[styles.button, style, loading && styles.disabled]} onPress={onPress} disabled={loading}>
            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text style={[styles.text, textStyle, { marginLeft: 8 }]}>
                        Please wait...
                    </Text>
                </View>
            ) : (
                <Text style={[styles.text, textStyle]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

export default LoadingButton;

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#1E90FF',
        borderRadius: 10,
        alignItems: 'center',
        width: 'full',
        height: 40,
        justifyContent: 'center'


    },
    text: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    disabled: {
        opacity: 0.7,
    },
    loaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});