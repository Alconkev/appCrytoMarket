import React, {Component } from 'react';
import { View, Text, FlatList,ActivityIndicator, Pressable,StyleSheet } from 'react-native';
import Http from '../../libs/http';
import CoinsItem from './CoinsItem';
import CoinsSearch from './CoinsSearch';
import Colors from '../../res/colors';


class CoinsScreen extends Component {

    state ={
        coins:[],
        allCoins: [],
        loading:false
    }

    componentDidMount = async () => {
        this.getCoins();
    }

    handlePress = (coin) => {
        this.props.navigation.navigate('CoinDetail',{coin});
    }

    getCoins = async () => {
        this.setState({ loading: true});
        const res = await Http.instance.get("https://api.coinlore.net/api/tickers/");
        this.setState({ coins: res.data, allCoins:res.data, loading: false});
    }

    handleSearch = (query) => {
        const { allCoins } = this.state;

        const coinsFiltered = allCoins.filter((coin) => {
            return coin.name.toLowerCase().includes(query.toLowerCase()) || 
            coin.symbol.toLowerCase().includes(query.toLowerCase());
         })

         this.setState({coins: coinsFiltered});
    }

    render() {

        const {coins, loading} = this.state;

        return (
            <View style={styles.container}>
                <CoinsSearch onChange={this.handleSearch} />
                { loading ? 
                <ActivityIndicator color="#fff" size="large" style={styles.loader} />: null }
                <FlatList
                    data={coins}
                    renderItem={({ item }) => 
                        <CoinsItem 
                            item={item} 
                            onPress={() => this.handlePress(item)} 
                        />                   
                   } 
                />                
            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: Colors.charade
    },
    titleText:{
        color: "#000",
        textAlign: "center"  
    },
    btn:{
        padding: 8,
        backgroundColor: "blue",
        borderRadius: 8,
        margin: 16
    },
    btnText:{
        color: "#fff",
        textAlign: "center"
    },
    loader: {
        marginTop:60
    }
});

export default CoinsScreen;