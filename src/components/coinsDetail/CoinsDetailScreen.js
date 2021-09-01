import React,{Component, useState} from 'react';
import { View, Text, Image, StyleSheet, SectionList , FlatList, Pressable, Alert } from 'react-native';
import Colors from '../../res/colors';
import Http from '../../libs/http';
import Storage from '../../libs/storage';
import CoinMarketItem from './coinMarketItem';

class CoinsDetailScreen extends Component {

    state = {
        coin: {},
        markets: [],
        isFavorite: false
    }

    toogleFavorite = () =>{
        if(this.state.isFavorite){
            this.removeFavorite();
        }else{
            this.addFavorite();
        }
    }

    addFavorite = async() => {
        const coin = JSON.stringify(this.state.coin);
        const key = `favorite-${this.state.coin.id}`;
        const stored = await Storage.instance.add(key, coin);
        if(stored){
            this.setState({isFavorite: true});
        }
    }

    removeFavorite = async() => {
        Alert.alert("Remove favorire","are you sure?",[
            {
                text:"cancel",
                onPress:()=>{},
                style: "cancel"
            },
            {
               text:"Remove",
               onPress: async() =>{
                    const key = `favorite-${this.state.coin.id}`;
                    await Storage.instance.remove(key);
                    this.setState({isFavorite: false});
                },
                style: "destrutive"
            }
        ])
        
    }

    getFavorite = async() =>{

        try{
            const key = `favorite-${this.state.coin.id}`;
            const favStr = await Storage.instance.get(key);
            if(favStr != null){
                this.setState({isFavorite: true});
            }
        }
        catch(err){
            console.log(err);
        }
    }

    getImgArrow = (coin) => {

        if(coin.percent_change_1h > 0){

            return require('../../assets/arrow_up.png');

        }else{
            return require('../../assets/arrow_down.png');
        }
    };

    getSymbolIcon = (name) =>{
        if(name){
            const symbol = name.toLowerCase().replace(" ","-");
            console.log(`https://www.coinlore.com/img/25x25/${symbol}.png`)
            return `https://www.coinlore.com/img/25x25/${symbol}.png`;
        }
    }

    getMarkets = async (coinId) =>{

        const url =`https://api.coinlore.net/api/coin/markets/?id=${coinId}`;

        const markets = await Http.instance.get(url);

        this.setState({markets});

    }

    componentDidMount() {

        const {coin} = this.props.route.params;

        this.props.navigation.setOptions({title: coin.symbol});

        this.getMarkets(coin.id);

        this.setState({coin}, () =>{
            this.getFavorite();
        });
    }

    getSection = (coin) =>{
        const data = [
        {
            title: 'Market Cap',
            data: [coin.market_cap_usd],
            icon: ''
        },
        {
            title: 'Volume 24h',
            data: [coin.volume24],
            icon: ''
        },
        {
            title: 'Change 24h',
            data: [coin.percent_change_24h],
            icon: this.getImgArrow(coin)
        }]

        return data;
    }


    render(){

        const {coin, markets, isFavorite } = this.state;

        return (

            <View style={styles.container}>
              <View style={styles.subHeader}>
                  <View style={styles.row}>
                    <Image styles={styles.imageIcon} source={{ uri: this.getSymbolIcon(coin.name)}} />
                    <Text style={styles.titleText}>{coin.name}</Text>
                  </View>
                  <Pressable
                        onPress={this.toogleFavorite}
                        style ={[styles.btnFavorite,
                            isFavorite ? 
                            styles.btnFavoriteRemove: 
                            styles.btnFavoriteAdd
                        ]}                 
                    >
                    <Text style={styles.btnFavoriteText}>{isFavorite ? "Romove favorite":"Add favorite"}</Text>
                  </Pressable>
              </View>
              <View>
                <SectionList 
                    styles={styles.section}
                    sections={this.getSection(coin)}
                    keyExtractor={(item) => item}
                    renderItem={ ({item}) => 
                        <View style={styles.sectionItem}>
                            <Text style={styles.itemText}>{item}</Text>
                        </View>
                    }                
                    renderSectionHeader={({section}) => 
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionText} >{section.title}</Text>
                            
                        </View> 
                    }
                />
              </View>
              <Text style={styles.marketsTitle}>Markets</Text>
                <FlatList style={styles.list}
                    horizontal={true}
                    data={markets}
                    renderItem={({item}) => <CoinMarketItem  item={item} />}
                />
            </View>
        );

    }

}

const styles = StyleSheet.create({
    row:{
        flexDirection: 'row',
    },
    container: {
        flex: 1,
        backgroundColor: Colors.charade
    },
    subHeader:{
        backgroundColor: "rgba(0,0,0,0.1)",
        padding:16,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    titleText:{
        fontSize:16,
        color: Colors.white,
        fontWeight: "bold",
        marginLeft: 8
    },
    marketsTitle:{
        color: Colors.white,
        fontSize: 16,
        marginTop: 10,
        marginBottom:16,
        marginLeft: 16
    },
    imageIcon:{
        width:25,
        height:25
    },
    imageIconArrow:{
        marginLeft: 5,
        width:25,
        height:25
    },
    section:{
        maxHeight:220,

    },
    sectionHeader:{
        backgroundColor: "rgba(0,0,0,0.2)",
        padding: 8
    },
    list:{
        maxHeight:100,
        paddingLeft: 16
    },
    itemText:{
        padding:8,
        color: Colors.white,
    },
    sectionText:{
        color: Colors.white,
        fontSize:14,
        fontWeight: "bold"
    },
    btnFavorite: {
        padding: 8,
        borderRadius:8
    },
    btnFavoriteAdd:{
        backgroundColor: Colors.picton
    },
    btnFavoriteRemove:{
        backgroundColor: Colors.carmine
    },
    btnFavoriteText:{
        color: Colors.white,
    }
   
});

export default CoinsDetailScreen;