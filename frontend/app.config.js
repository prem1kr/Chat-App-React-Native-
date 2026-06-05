import 'dotenv/config';

export default {
  expo: {
    name: "chat-app",
    slug: "chat-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "chatapp",
    userInterfaceStyle: "automatic",

    ios: {
      icon: "./assets/images/icon.png",
    },

    android: {
      package: "com.premkumar.chatapp",
      adaptiveIcon: {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/icon.png",
        "backgroundImage": "./assets/images/icon.png",
        "monochromeImage": "./assets/images/icon.png"
      },
      predictiveBackGestureEnabled: false,
    },

    web: {
      output: "static",
      favicon: "./assets/images/icon.png",
    },

    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#208AEF",
          android: {
            image: "./assets/images/icon.png",
            imageWidth: 76,
          },
        },
      ],
    ],

    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },

    extra: {
      API_URL: process.env.API_URL,
      SOCKET_URL: process.env.SOCKET_URL,
      GOOGLE_MAPS_KEY: process.env.GOOGLE_MAPS_KEY,

      eas: {
        projectId: "87d12a1e-09c2-4e9d-bcd1-b9deeedd6523",
      },
    },
  },
};