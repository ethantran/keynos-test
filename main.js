// @flow

import Expo, { Constants } from 'expo';
import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, ScrollView } from 'react-native';
import Swipeable from 'react-native-swipeable';
import { Map, List } from 'immutable';
import { MaterialIcons } from '@expo/vector-icons'

class App extends React.Component {
  state = {
    data: Map({
      items: List([
        Map({ name: 'Conv 1', selector: 'b', favored: false }),
        Map({ name: 'Conv 2', selector: 'a', favored: false }),
        Map({ name: 'Conv 3', selector: 'a', favored: false }),
        Map({ name: 'Conv 4', selector: 'b', favored: false }),
        Map({ name: 'Conv 5', selector: 'b', favored: false }),
      ])
    })
  }
  setImmState(fn) {
    return this.setState(({ data }) => ({
      data: fn(data)
    }));
  }
  favorItem = (favoredItem) => {
    this.setImmState(d => {
      return d.update('items', list => {
        return list.update(
          list.findIndex(item => {
            return item.get('name') === favoredItem.get('name');
          }),
          item => {
            return item.set('favored', !item.get('favored'));
          }
        )
      });
    });
  }
  renderItem = (item, i) => {
    const name = item.get('name')
    const iconColor = item.get('favored') ? 'blue' : 'white'
    if (this.state.selector && this.state.selector !== item.get('selector'))
      return null
    return (
      <Swipeable
        key={name}
        rightButtons={[
          <TouchableHighlight style={styles.favorButton} onPress={() => this.favorItem(item)}>
            <MaterialIcons name="star" size={30} color={iconColor} />
          </TouchableHighlight>
        ]}
        rightButtonWidth={45}
      >
        <View style={styles.item}>
          <Text style={styles.itemText}>{name}</Text>
          <MaterialIcons name="star" size={15} color={iconColor} />
        </View>
      </Swipeable>
    )
  }
  filterBySelector = (selector) => {
    if (selector === this.state.selector) {
      this.setState({ selector: null })
    } else {
      this.setState({ selector })
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.selectors}>
          <TouchableHighlight onPress={() => this.filterBySelector('a')}>
            <Text style={[
              styles.selector,
              this.state.selector === 'a' && styles.selectorSelected
            ]}>Selector A</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.filterBySelector('b')}>
            <Text style={[
              styles.selector,
              this.state.selector === 'b' && styles.selectorSelected
            ]}>Selector B</Text>
          </TouchableHighlight>
        </View>
        {this.state.data.get('items').map(this.renderItem)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: Constants.statusBarHeight
  },
  item: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#CCCCCC'
  },
  itemText: {
    flex: 1
  },
  favorButton: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: '#CCCCCC',
    padding: 5
  },
  selectors: {
    flexDirection: 'row'
  },
  selector: {
    padding: 10
  },
  selectorSelected: {
    fontWeight: 'bold'
  }
});

Expo.registerRootComponent(App);
