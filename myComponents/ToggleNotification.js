import React, { useState } from "react";
import { View, Pressable, Text } from "react-native";
import styles from '../styles';


export default function ToggleNotification({notificationsOn, handleNotificationToggle}){

    return (
      <View style={styles.notificationToggleButtonGeneric}>
        <Pressable
          style={[
            styles.notificationToggleButtonOff,
            notificationsOn
              ? styles.notificationToggleButtonOn
              : styles.notificationToggleButtonOff,
          ]}
          onPressIn={() => handleNotificationToggle(notificationsOn)}
        >
          <Text>Toggle Notification</Text>
        </Pressable>
      </View>
    );
}