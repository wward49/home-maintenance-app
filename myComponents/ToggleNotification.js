
import { View, Pressable, Text } from "react-native";
import styles from '../styles';


export default function ToggleNotification({notificationsOn, handleNotificationToggle}){

    return (
      <View style={styles.notificationToggleButtonGeneric}>
        <Pressable
          style={[
            styles.notificationToggleButtonOff,
            notificationsOn
              ? styles.toggleOnStyle
              : styles.notificationToggleButtonOff,
          ]}
          onPressIn={() => handleNotificationToggle(notificationsOn)}
        >
          <Text>Toggle Notification</Text>
        </Pressable>
      </View>
    );
}