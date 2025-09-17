import React, { useState, useRef} from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Platform, TouchableOpacity, ScrollView, Button, Alert, Modal, Pressable, TextInput} from 'react-native';
import { Calendar } from 'react-native-calendars';
//Views are like Divs
//Text displays text on screen
//Function compoments
//onPress={() => console.log("Text Clicked!")} ... ....In line function
//const handlePress = () => console.log("Text Pressed!"); ... ...function... ...hook it up to an action like onPress
//functions need { }...after the arrow when they are doing more than 1 thing
//array deconstructing: const [current_vale, updater_function] = useState(firstInitialValue);


export default function App() {
  const [items, insertItems] = useState([]);
  const [visible, setVisible] =useState(false);
  const[userChoice, setUserChoice] = useState('weekly');

  const[taskName, setTaskName] = useState('')
  const[notificationsOn, setNotificationFlag] = useState(false);


  const scrollRef = useRef(null);

  const repeatOptions = ['weekly', 'biweekly', 'monthly'];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const show = () => setVisible(true);
  const hide = () => setVisible(false);
  

  const handleRepeatOptionPress = (clickedOption) => {
    setUserChoice(clickedOption);
    console.log("User Picked:", clickedOption);
  }

  const handleInsertItemPress = () => {

    insertItems(previousList => [...previousList, `New Item ${previousList.length + 1}`])

    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true});
    }
    );
  };

  const handleRemoveItemPress = (indexToRemove) => {
    Alert.alert('Remove Task?',
      'Task will be deleted forever',
      [{text: 'Cancel', style: 'cancel'}, 
        {text: 'Delete', style: 'destructive', 
          onPress: () => { 
            insertItems(previousList => previousList.filter((_, i) => i !== indexToRemove));
          },
        },
      ]
    );
  };

  const  handleTaskNameInput = (newTaskName) => {
    setTaskName(newTaskName);
  }

  const handleNotificationToggle = (flag) => {
    console.log('Toggled Notifications');
    setNotificationFlag(!flag);
  }

  return (
    <SafeAreaView style={styles.appContainer}>

      {/*Container for the Calendar*/}
      <View style={styles.calendarContainer}>
        <Calendar
          style={styles.calendarStyle}
          firstDay={1}
          theme={{
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 12,
          }}
        
        />
      </View>

      {/*Container for the scrollable list of tasks that have been added*/}
      <View style={styles.listOfTasks}>
        <ScrollView ref={scrollRef}>
          {items.map((txt, i) => {
            return(
            <TouchableOpacity key={i} style={styles.taskItem} onPress={() => handleRemoveItemPress(i)}>
              <Text style={styles.taskItemText}>{txt}</Text>
            </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
      
      {/*Container for the Button for adding tasks*/}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonInteractable} onPress={show}>
          <Text>Add Item</Text>
        </TouchableOpacity>
      </View>

      {/*Container for the Panel for setting up a new task*/}
      <Modal visible={visible} transparent animationType='slide'>

          {/*Panel Itself */}
          <View style={styles.panel}>

            {/*Repeat Selector */}
            <View style={styles.testBox}>
              {repeatOptions.map(option => 
                (
                <Pressable key={option} onPress={() => handleRepeatOptionPress(option)} style={[styles.repeatStyle, userChoice === option && styles.pillSelectedStyle]}>
                  <Text style={styles.repeatTextStyle}>{option}</Text>
                </Pressable>
                ))}
              
            </View>

            {/*Day Selector */}
            <View style={styles.testBox }> 
                {/**If Weekly or Bi Weekly, Then show the Day of the Week Picker. If Monthly, Allow user to enter the day of the month, and number of months to wait (1-12) */}
              <View style={styles.daysBoxContainer}>
                {daysOfWeek.map(day => (
                  <Pressable key={day} style={styles.dayBox}>
                    <Text>
                      {day}
                    </Text>
                  </Pressable>
                    ))}
              </View>

            </View>

            {/*Task Name and Notification Selector */}
            <View style={styles.testBox}>
                {/**User types a name and then picks whether to have notifications sent to phone or not. */}
                <Text>Name of Task:</Text>
                <TextInput placeholder="Task Name Here" value={taskName} onChangeText={handleTaskNameInput}/>
                <Text>{taskName}</Text>

                <Pressable style={[styles.notificationToggleButtonOff, notificationsOn ? styles.notificationToggleButtonOn : styles.notificationToggleButtonOff ]} onPressIn={ () => handleNotificationToggle(notificationsOn)}>
                  <Text>Toggle Notification</Text>
                </Pressable>

            </View>
          
            {/*Finalize Task Confirmation Button */}
            <View style={styles.testBox}>
                {/**Add the item to the list, Set the variables back to default after finished, and then close the window */}
                
            </View>

          </View>

          {/*CLOSE BUTTON FOR PANEL*/}
          <View style={styles.panelCloseButtonContainer}>
            <TouchableOpacity style={styles.closePanelButton} onPress={hide}>
              <Text style={{fontSize: 28,}}>X</Text>
            </TouchableOpacity>
          </View>
      </Modal>

    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#c9ab00ff",
    justifyContent: 'flex-end',

  },
  listOfTasks: {
    marginTop : StatusBar.currentHeight,
    
    backgroundColor: "#5fe710ff",
    width: '70%',
    height: 300,
    alignSelf: 'center',
    marginBottom: 30,

    borderWidth: 5,
    borderColor: "#000000ff",

  },
  taskItem: {
    
    backgroundColor: "#95f199ff",
    marginBottom: 1,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#000000ff",
    width: '100%',
    height: 48,

  },
  taskItemText: {
    fontSize: 16,
    color: "#f100c9ff",
    alignSelf: "center"
  },

  buttonContainer: {
    width : 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 50,

  },
  buttonInteractable: {
    flex: 1,
    backgroundColor: '#cc3232ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000000ff",

  },

  calendarContainer: {
    
    width: '95%',
    alignSelf: 'center',
    backgroundColor: '#aa9deeff',
    borderWidth: 2,
    borderColor: "#000000ff",
  },

  calendarStyle: {

  },

  taskSetUpContainer: {
    flex: 1,
  },

  panel: {
    flex:1,
    backgroundColor: 'rgba(219, 207, 172, 0.95)',
    justifyContent: 'flex-start',
  },

  panelCloseButtonContainer: {
    position: 'absolute',
    backgroundColor: "#ecba77ff",
    width: 50,
    height: 50,
    borderRadius: 100,
    top: 16,
    right: 16,
    borderWidth: 3,
  },
  closePanelButton: {
    width:"100%",
    height: "100%",
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    
  },

  testBox: {
    width: "90%",
    height: 200,
    borderWidth: 3,
    marginBottom: 10,
    alignSelf: "center",
  },

  repeatStyle: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 6,
    marginVertical: 2,
    borderRadius: 30,
    borderWidth: 2,
  },

  repeatTextStyle: {
    fontSize: 24,
    color: "#000000ff",
    alignSelf: "center"
  },

  pillSelectedStyle: {
    backgroundColor: '#6ee749cb',
    borderBlockColor: '#000000cb'
  },

  daysBoxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    

  },
  dayBox: {
    borderWidth: 1,
    width: '20%',
    height: '55%',
    marginTop: 5,
    marginLeft: 5,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  notificationToggleButtonOff: {
    borderWidth: 3
  },
    notificationToggleButtonOn: {
    borderWidth: 5,
    backgroundColor: '#d18a38ff'
  },

});