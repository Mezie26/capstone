import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    Image, 
    Pressable,
    FlatList,
    StatusBar} from "react-native";
import { Menu, Searchbar} from "react-native-paper";
import * as SQLite from 'expo-sqlite';
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen ({navigation}) {
    const [firstname, setFirstname] = useState("");
    const [image, setImage] = useState(null);
    const [data, setData] = useState([]);


    const getHomeScreenDetails = async () => {
        try {
            const LoginDetails = await AsyncStorage.multiGet(["firstname", "image"]);

            const firstname = LoginDetails[0][1] || "";
            const image = JSON.parse(LoginDetails[1][1]) || null;

            setFirstname(firstname);
            setImage(image)

            console.log('Login details retrieved successfully!!')
        } catch (error) {
            console.log('Error retrieving Login details', error)
        }

        //Check if Menu Data is available
        try {
          const db = SQLite.openDatabaseSync('little_lemon');
          await db.runAsync(
            "CREATE TABLE IF NOT EXISTS menu(id INTEGER PRIMARY KEY NOT NULL, name TEXT, price INTEGER, description TEXT, image TEXT, category TEXT)"
          )
          let menuItems = await db.getAllAsync('SELECT * FROM menu');
          setData(menuItems)
          console.log(menuItems)


          //Fetch and update data
          if (!menuItems.length) {
              const response = await fetch('https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json');
              console.log('data fetched successfully')
              const menuItems = await response.json();
              console.log('menu parsed')
              console.log(menuItems)
              menuItems.menu[0].image = "https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/greekSalad.jpg?raw=true";
              menuItems.menu[1].image = "https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/bruschetta.jpg?raw=true";
              menuItems.menu[2].image = "https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/grilledFish.jpg?raw=true";
              menuItems.menu[3].image = "https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/pasta.jpg?raw=true";
              menuItems.menu[4].image = "https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/lemonDessert.jpg?raw=true";
              console.log(menuItems.menu[4].image)
              console.log('fetched and repaired data successfully');


              //Store data in SQLite database
               await db.execAsync(`
                CREATE TABLE IF NOT EXISTS menu(id INTEGER PRIMARY KEY NOT NULL, name TEXT, price INTEGER, description TEXT, image TEXT, category TEXT);
                INSERT INTO menu (name, price, description, image, category) VALUES ("${menuItems.menu[0].name}", ${menuItems.menu[0].price}, "${menuItems.menu[0].description}", "${menuItems.menu[0].image}", "${menuItems.menu[0].category}");
                INSERT INTO menu (name, price, description, image, category) VALUES ("${menuItems.menu[1].name}", ${menuItems.menu[1].price}, "${menuItems.menu[1].description}", "${menuItems.menu[1].image}", "${menuItems.menu[1].category}");
                INSERT INTO menu (name, price, description, image, category) VALUES ("${menuItems.menu[2].name}", ${menuItems.menu[2].price}, "${menuItems.menu[2].description}", "${menuItems.menu[2].image}", "${menuItems.menu[2].category}");
                INSERT INTO menu (name, price, description, image, category) VALUES ("${menuItems.menu[3].name}", ${menuItems.menu[3].price}, "${menuItems.menu[3].description}", "${menuItems.menu[3].image}", "${menuItems.menu[3].category}");
                INSERT INTO menu (name, price, description, image, category) VALUES ("${menuItems.menu[4].name}", ${menuItems.menu[4].price}, "${menuItems.menu[4].description}", "${menuItems.menu[4].image}", "${menuItems.menu[4].category}");
                `);
                console.log('Menu data updated successfully')

              //Retrieve and Render SQLite Data in Flatlist
              const retrievedMenuData = await db.getAllAsync('SELECT * FROM menu');
              setData(retrievedMenuData);
              console.log('Menu data retrieved successfully!!!')
            }
        } catch (error) {
          console.log('Error retrieving data from database')
        }
    }

    useEffect(()=>{
        getHomeScreenDetails();
    }, []);

    const placeholder = firstname.charAt(0)

    const Item = ({ name, price, description, image }) => (
      <View>
        <Text style={{fontWeight: "bold", marginLeft: 10, marginTop: 10}}>{name}</Text>
        <View style={styles.menuView}>
        <Text style={styles.menuDescription}>{description}</Text>
        <Image source={{uri: image}} style={styles.menuImages}/>
        </View>
        <Text style={{marginLeft: 10}}>${price}</Text>
      </View>
    );

    const seperator = () => {
      return (
          <View style={styles.seperator} />
      )
    };

    return(
        <SafeAreaView style={styles.container}>
        <View style={styles.headerwrapper}>
           <Image
             style={styles.headerimage}
             source={require("../img/littlelemonicon.png")}
           />
           <Text style={styles.headertext}>Little Lemon</Text>
           <Pressable style={styles.profileimageContainer} onPress={()=> navigation.navigate('Profile')}>
            {image ? (
                <Image source={{uri: image}} style={styles.profileimage}/>
            ) : (
                <Text style={styles.profileimagetext}>{placeholder}</Text>
            )}
            </Pressable>
         </View>
         <View style={styles.bannerBackground}>
              <Text style={styles.bannerHeader}>Little Lemon</Text>
              <Text style={styles.bannerSubheading}>Chicago</Text>
              <View style={styles.bannerFlexView}>
                <Text style={styles.bannerDescription}>
                  We are a family owned 
                  Mediterranean restaurant, focused on traditional recipes served with a modern twist.
                </Text>
                <Image source={require('../img/Hero image.png')} style={styles.bannerImage}/>
              </View>
              <Searchbar
              placeholder="Search"
              placeholderTextColor='#A9A9A9'
              //onChangeText={handleSearchChange}
              //value={searchBarText}
              style={styles.searchBar}
              inputStyle={styles.searchtext}
              elevation={0}
              />
          </View>
          <FlatList
            data={data}
            renderItem={({item}) => (
              <Item name={item.name} price={item.price} description={item.description} image={item.image}/>
            )}
            ItemSeparatorComponent={seperator}></FlatList>
       </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
      },
      headerwrapper: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        marginBottom: 70,
      },
      headerimage: {
        width: 30,
        height: 40,
        resizeMode: "contain",
      },
      headertext: {
        paddingRight: 10,
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 10,
        marginRight: 60,
        height: 200,
        fontSize: 20,
        color: "#495E57",
        textAlign: "center",
      },
      profileimageContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginLeft: 10,
        marginRight: 20,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        backgroundColor: "#495E57",
      },
      profilebutton: {
        width: 70,
        height: 70
      },
      profileimagetext: {
        fontSize: 30,
        color: "#FFFFFF",
        fontWeight: "600",
      },
      profileimage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 2,
        borderColor: "#fff",
        resizeMode: "cover",
      },
      bannerBackground: {
        height: 220,
        backgroundColor: '#495E57'
      },
      bannerHeader: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#F4CE14',
        marginLeft: 10
      },
      bannerSubheading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#EDEFEE',
        marginLeft: 10,
      },
      bannerFlexView: {
        flexDirection: 'row',
      },
      bannerDescription: {
        fontSize: 15,
        color: '#EDEFEE',
        marginTop: 10,
        height: 55,
        width: 300,
        marginLeft: 10,
        marginBottom: 1,
      },
      bannerImage: {
        height: 100,
        width: 100,
        borderRadius: 10,
        resizeMode: 'cover',
        marginBottom: 1,
      },
      searchBar: {
        marginBottom: 24,
        height: 35,
        width: 300,
        backgroundColor: '#EDEFEE',
        shadowRadius: 0,
        shadowOpacity: 0,
      },
      searchtext: {
        color: '#333333', 
        minHeight: 0,
        height: 35,
      },
      menuView: {
        flexDirection: 'row'
      },
      menuDescription: {
        margin: 10,
        fontSize: 13,
        width: 300,
      },
      menuImages: {
        height: 70,
        width: 70,
      },
      seperator: {
        backgroundColor: '#333333',
        height: 1,
        width: 400,
        justifyContent: 'center',
        textAlign: 'auto',
        margin: 10,
      },
})