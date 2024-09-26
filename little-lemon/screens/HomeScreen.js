import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    Image, 
    Pressable,
    FlatList,
  } from "react-native";
import { Searchbar } from "react-native-paper";
import * as SQLite from 'expo-sqlite';
import debounce from "lodash.debounce";

export default function HomeScreen ({navigation}) {
    const [firstname, setFirstname] = useState("");
    const [image, setImage] = useState(null);
    const [data, setData] = useState([]);
    const [filterSelection, setFilterSelection] = useState(true);
    const [filterButtonStyle, setFilterButtonStyle] = useState("");
    const [searchBarText, setSearchBarText] = useState("");


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
          setData(menuItems);
          console.log('Menu Items retrieved successfully!!!');
          setFilterSelection(true);
          setFilterButtonStyle("");


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
              console.log('Menu data retrieved successfully!!!');
              setFilterSelection(true);
              setFilterButtonStyle("");
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

    const handleSearchChange = async (text) => {
      setSearchBarText(text);
        try {
          const db = SQLite.openDatabaseSync('little_lemon');
          console.log('database opened');
          const queriedData = await db.getAllAsync(`SELECT * FROM menu WHERE name LIKE "%${text}%"`);
          debounce(handleSearchChange, 500)
          console.log("searching");
          setData(queriedData);
        } catch (error) {
          console.log("error searching data")
        }
      }

    async function filter(category, filterButtonColor) {
      try {
        const db = SQLite.openDatabaseSync('little_lemon');
        console.log('database opened')
        const filteredData = await db.getAllAsync(`SELECT * FROM menu WHERE category = "${category}"`);
        console.log('filtering')
        setData(filteredData);
        setFilterSelection(false);
        setFilterButtonStyle(filterButtonColor)
        console.log('data filtered')
      } catch (error) {
        console.log('error filtering data')
      }
    }

    return(
        <View style={styles.container}>
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
              onChangeText={handleSearchChange}
              value={searchBarText}
              style={styles.searchBar}
              inputStyle={styles.searchtext}
              elevation={0}
              />
          </View>
          <View style={styles.titleView}>
            <Text style={styles.titleText}>ORDER FOR DELIVERY!</Text>
            <Image source={require('../img/Delivery van.png')} style={styles.titleImage} />
          </View>
          <View style={{flexDirection: 'row'}}>
          <Pressable style={{...styles.menuFilterButton, backgroundColor: filterButtonStyle !== "starters" ? '#D3D3D3' : '#495E57'}} onPress={()=> {filterSelection ? 
            filter("starters", "starters") : getHomeScreenDetails()
          }}>
            <Text style={{...styles.menuFilterText, color: filterButtonStyle !== "starters" ? '#495E57' : '#EDEFEE'}}>Starters</Text>
          </Pressable>
          <Pressable style={{...styles.menuFilterButton, backgroundColor: filterButtonStyle !== "mains" ? '#D3D3D3' : '#495E57'}} onPress={()=> {filterSelection ? 
            filter("mains", "mains") : getHomeScreenDetails()
          }}>
            <Text style={{...styles.menuFilterText, color: filterButtonStyle !== "mains" ? '#495E57' : '#EDEFEE'}}>Mains</Text>
          </Pressable>
          <Pressable style={{...styles.menuFilterButton, backgroundColor: filterButtonStyle !== "desserts" ? '#D3D3D3' : '#495E57'}} onPress={()=> {filterSelection ? 
            filter("desserts", "desserts") : getHomeScreenDetails()
          }}>
            <Text style={{...styles.menuFilterText, color: filterButtonStyle !== "desserts" ? '#495E57' : '#EDEFEE'}}>Desserts</Text>
          </Pressable>
          <Pressable style={{...styles.menuFilterButton, backgroundColor: filterButtonStyle !== "drinks" ? '#D3D3D3' : '#495E57'}} onPress={()=> {filterSelection ? 
            filter("drinks", "drinks") : getHomeScreenDetails()
          }}>
            <Text style={{...styles.menuFilterText, color: filterButtonStyle !== "drinks" ? '#495E57' : '#EDEFEE'}}>Drinks</Text>
          </Pressable>
          </View>
          <FlatList
            data={data}
            renderItem={({item}) => (
              <Item name={item.name} price={item.price} description={item.description} image={item.image}/>
            )}
            ItemSeparatorComponent={seperator}></FlatList>
       </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
      headerwrapper: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 10,
      },
      headerimage: {
        width: 30,
        height: 40,
        resizeMode: "contain",
      },
      headertext: {
        paddingRight: 10,
        paddingLeft: 10,
        paddingTop: 6,
        paddingBottom: 10,
        marginRight: 60,
        height: 60,
        fontSize: 20,
        fontWeight: 'bold',
        color: "#495E57",
        textAlign: "center",
      },
      profileimageContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
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
        marginTop: 1,
        height: 240,
        backgroundColor: '#495E57',
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
        height: 60,
        width: 290,
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
      titleView: {
        flexDirection: 'row',
        margin: 10,
      },
      titleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        marginRight: 20,
      },
      titleImage: {
        height: 20,
        width: 50,
        resizeMode: 'contain'
      },
      menuFilterButton: {
        padding: 5,
        width: 70,
        borderRadius: 10,
        margin: 10,
        marginTop: 3,
        marginRight: 20,
        textAlign: 'center'
      },
      menuFilterText: {
        textAlign: 'center',
        fontSize: 13,
        fontWeight: 'bold',
        paddingTop: 3,
        paddingBottom: 3,
      },
})