import React, { useState, useCallback, useEffect } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PalettePreview from '../components/PalettePreview';

const Home = ({ navigation, route }) => {
    const newColorPalette = route.params ? route.params.newColorPalette : undefined;
    const [colorPalettes, setColorPalettes] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchColorPalettes = useCallback(async () => {
        const results = await fetch('https://color-palette-api.kadikraman.now.sh/palettes');

        if (results.ok) {
            const palettes = await results.json();
            setColorPalettes(palettes);
        }
    }, []);

    useEffect(() => {
        fetchColorPalettes();
    }, []);

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        await fetchColorPalettes();
        setTimeout(() => {
            setIsRefreshing(false)
        }, 1000);
    }, []);

    useEffect(() => {
        if (newColorPalette) {
            setColorPalettes(palettes => [newColorPalette, ...palettes]);
        }
    }, [newColorPalette]);

    return (
        <FlatList style={styles.list}
            data={colorPalettes}
            keyExtractor={item => item.paletteName}
            renderItem={({ item }) => (
                <PalettePreview
                    handlePress={() => {
                        navigation.navigate('ColorPalette', item)
                    }}
                    colorPalette={item}
                />
            )}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            ListHeaderComponent={
                <TouchableOpacity onPress={() => { navigation.navigate('ColorPaletteModal') }}>
                    <Text style={styles.buttonText}>
                        Add a color scheme
                    </Text>
                </TouchableOpacity>
            }
        ></FlatList>
    );
};

const styles = StyleSheet.create({
    list: {
        padding: 10,
        backgroundColor: 'white',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'teal',
        marginBottom: 10,
    }
})

export default Home;