import { StyleSheet, StatusBar } from "react-native"; 
//This styles page could really be reworked a lot. There are many styles that do almost the exact same thing and could be used generally by different ui components. 
//honestly messing with styling is one of my least favorite things to do...Although it is nice when things finally start to come together after getting margins and box sizes to work out together.
export default StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#e0ad61ff",
    justifyContent: 'flex-end',

  },
  listOfTasks: {
    marginTop : StatusBar.currentHeight,
    
    backgroundColor: "#fceca5ff",
    width: '70%',
    height: 300,
    alignSelf: 'center',
    marginBottom: 30,

    borderWidth: 5,
    borderColor: "#000000ff",

  },
  taskItem: {
    
    backgroundColor: "#e4b075ff",
    marginTop: 1,
    marginBottom: 1,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#000000ff",
    width: '99%',
    height: 52,
    alignSelf: 'center',

  },
  taskItemText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#444444ff",
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
    backgroundColor: '#f1d69aff',
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
  offsetTextStyle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: "#000000ff",
    alignSelf: "center"
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

  notificationToggleButtonGeneric: {
    alignItems: "center",
    marginTop: '5%',
    borderRadius: 5,
  },

  notificationToggleButtonOff: {
    borderWidth: 3,
  },

  toggleOnStyle: {
    borderWidth: 5,
    backgroundColor: '#d18a38ff',
  },

  inputBox: {
    alignSelf: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    height: 60,
    borderWidth: 2,
    fontSize: 24,
    width: '80%',
    marginTop: '5%',
  },

  taskItemHighlighted: { 
    backgroundColor: '#eef6ff',
  }, 

  taskItemTextHighlighted: { 
    color: '#3d65e9ff', 
    fontWeight: '700',
  },


});