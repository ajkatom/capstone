/* eslint-disable */
import React from 'react';
import { StyleSheet, Text, View, Button, TouchableHighlight } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator } from 'react-navigation';
import Info from './native-components/Info';
import Login from './native-components/Login';
import ChooseBar from './native-components/ChooseBar';
import PregameCountdown from './native-components/PregameCountdown';
import PregameStatic from './native-components/PregameStatic';
import TeamName from './native-components/TeamName';
import QuestionActive from './native-components/QuestionActive';
import QuestionOver from './native-components/QuestionOver';
import QuestionWaiting from './native-components/QuestionWaiting';
import GameOver from './native-components/GameOver';
import socket from './socket';

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <Button title="About" onPress={() => navigation.navigate('Info')} />
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={ styles.h1 }>UnTapped Trivia</Text>
        <Button onPress={() => this.props.navigation.navigate('Login')} title="Play now" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 80
    // justifyContent: 'center',
  },
  h1: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingBottom: 35
  }
});

// questions and gameplay have to be switch navigator
// not being used right now
// const GameStack = createSwitchNavigator(
//   {
//     QuestionActive: {
//       screen: QuestionActive,
//       navigationOptions: {
//         title: 'Current Question'
//       }
//     },
//     QuestionOver: {
//       screen: QuestionOver,
//       navigationOptions: {
//         title: 'Question Over'
//       }
//     },
//     QuestionWaiting: {
//       screen: QuestionWaiting,
//       navigationOptions: {
//         title: 'Next Question coming soon'
//       }
//     }
//   }, {
//     initialRouteName: 'QuestionActive'
//   }
// )

const MainStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        title: 'Home',
      }
    },
    Login: {
      screen: Login,
      navigationOptions: {
        title: 'Login'
      }
    },
    ChooseBar: {
      screen: ChooseBar,
      navigationOptions: {
        title: 'Bar ID'
      }
    },
    TeamName: {
      screen: TeamName,
      navigationOptions: {
        title: 'Team Name'
      }
    },
    PregameCountdown: {
      screen: PregameCountdown,
      navigationOptions: {
        title: 'Next Game'
      }
    },
    // GamePlay: GameStack,
    QuestionActive: {
      screen: QuestionActive,
      navigationOptions: {
        title: 'Current Question',
        headerLeft: null
      }
    },
    QuestionOver: {
      screen: QuestionOver,
      navigationOptions: {
        title: 'Correct Answer',
        headerLeft: null
      }
    },
    QuestionWaiting: {
      screen: QuestionWaiting,
      navigationOptions: {
        title: 'Next Question',
        headerLeft: null
      }
    },
    GameOver: {
      screen: GameOver,
      navigationOptions: {
        title: 'Game Over',
        headerLeft: null
      }
    }
    // PregameStatic: PregameStatic,
  },
  {
    initialRouteName: 'Home', // will be set as home at end, changing for easier page testing
    // initialRouteName: 'QuestionActive',
    navigationOptions: {
      headerStyle: { backgroundColor: 'lightblue' }
    }
  }
)

// const TabStack = createBottomTabNavigator({
//   Home: MainStack,
//   // Profile: Profile
// })

const RootStack = createStackNavigator(
  {
    Main: MainStack,
    // GamePlay: GameStack,
    Info: Info
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
)

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.socket = socket
  }
  render() { return <RootStack /> }
}
