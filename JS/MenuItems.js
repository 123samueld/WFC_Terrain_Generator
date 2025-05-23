// Menu icon path constants
const MENU_ICON_PATHS = {
    MAIN: './Assets/Nested_Menu_Icons/01_Main_Menu_Icons/',
    BUILDINGS: './Assets/Nested_Menu_Icons/02_Buildings_Menu_Icons/',
    ROAD: './Assets/Nested_Menu_Icons/03_Road_Menu_Icons/',
    TRAIN: './Assets/Nested_Menu_Icons/04_Train_Menu_Icons/',
    TEMPLATE: './Assets/Nested_Menu_Icons/Template.png'
};

export const menuItems = {
    Main: {
        isLeafMenu: false,
        items: [

            {
                id: 0,
                image: MENU_ICON_PATHS.MAIN + '01_Buildings.png',
                text: 'Buildings',
                menu: 'Main'
            },
            {
                id: 1,
                image: MENU_ICON_PATHS.MAIN + '02_Roads.png',
                text: 'Roads',
                menu: 'Main'
            },
            {
                id: 2,
                image: MENU_ICON_PATHS.MAIN + '03_Train_Tracks.png',
                text: 'Train\nTracks',
                menu: 'Main'
            },
            {
                id: 3,
                image: MENU_ICON_PATHS.MAIN + '04_Power_Lines.png',
                text: 'Power\nLines',
                menu: 'Main'
            },
            {
                id: 4,
                image: MENU_ICON_PATHS.MAIN + '05_Pipes.png',
                text: 'Pipes',
                menu: 'Main'
            },
            {
                id: 5,
                placeholder: true
            },
            {
                id: 6,
                placeholder: true
            },
            {
                id: 7,
                placeholder: true
            },
            {
                id: 8,
                image: MENU_ICON_PATHS.MAIN + '08_Back.png',
                text: 'Back',
                menu: 'Main'
            },
            {
                id: 9,
                placeholder: true
            },
            {
                id: 10,
                placeholder: true
            },
            {
                id: 11,
                placeholder: true
            }
        ]
    },
    
    Roads: {
        isLeafMenu: true,
        items: [
            {
                id: 0,
                image: MENU_ICON_PATHS.ROAD + 'L_Curves/01_ES.png',
                text: 'L_ES',
                menu: 'Roads'
            },
            {
                id: 1,
                image: MENU_ICON_PATHS.ROAD + 'L_Curves/02_SW.png',
                text: 'L_SW',
                menu: 'Roads'
            },
            {
                id: 2,
                image: MENU_ICON_PATHS.ROAD + 'L_Curves/03_WN.png',
                text: 'L_WN',
                menu: 'Roads'
            },
            {
                id: 3,
                image: MENU_ICON_PATHS.ROAD + 'L_Curves/04_NE.png',
                text: 'L_NE',
                menu: 'Roads'
            },
            {
                id: 4,
                placeholder: true
            },
            {
                id: 5,
                placeholder: true
            },
            {
                id: 6,
                placeholder: true
            },
            {
                id: 7,
                placeholder: true
            },
            {
                id: 8,
                image: MENU_ICON_PATHS.MAIN + '08_Back.png',
                text: 'Back',
                menu: 'Roads'
            },
            {
                id: 9,
                placeholder: true
            },
            {
                id: 10,
                placeholder: true
            },
            {
                id: 11,
                placeholder: true
            }
        ]
    },

    Buildings: {
        isLeafMenu: true,
        items: [
            {
                id: 0,
                image: MENU_ICON_PATHS.BUILDINGS + '01_Power_Plant.png',
                text: 'Power\nStation',
                menu: 'Buildings',
                tileType: 'Power_Plant'
            },
            {
                id: 1,
                image: MENU_ICON_PATHS.BUILDINGS + '02_Factorum.png',
                text: 'Steel\nFoundry',
                menu: 'Buildings',
                tileType: 'Factorum'
            },
            {
                id: 2,
                image: MENU_ICON_PATHS.BUILDINGS + '03_Chem_Plant.png',
                text: 'Chemical\nPlant',
                menu: 'Buildings',
                tileType: 'Chemical_Plant'
            },
            {
                id: 3,
                image: MENU_ICON_PATHS.BUILDINGS + '04_Train_Station.png',
                text: 'Train\nStation',
                menu: 'Buildings',
                tileType: 'Train_Station'
            },
            {
                id: 4,
                image: MENU_ICON_PATHS.BUILDINGS + '05_Promethium_Refinery.png',
                text: 'Oil\nRefinery',
                menu: 'Buildings',
                tileType: 'Promethium_Refinery'
            },
            {
                id: 5,
                placeholder: true
            },
            {
                id: 6,
                placeholder: true
            },
            {
                id: 7,
                placeholder: true
            },
            {
                id: 8,
                image: MENU_ICON_PATHS.MAIN + '08_Back.png',
                text: 'Back',
                menu: 'Buildings'
            },
            {
                id: 9,
                placeholder: true
            },
            {
                id: 10,
                placeholder: true
            },
            {
                id: 11,
                placeholder: true
            }
        ]
    },

    Train_Tracks: {
        isLeafMenu: true,
        items: [
            {
                id: 0,
                image: './Assets/Nested_Menu_Icons/Train_Menu_Icons/Straight.png',
                text: 'Straight',
                menu: 'Train_Tracks'
            },
            {
                id: 1,
                image: './Assets/Nested_Menu_Icons/Train_Menu_Icons/Curve.png',
                text: 'Curve',
                menu: 'Train_Tracks'
            },
            {
                id: 2,
                image: './Assets/Nested_Menu_Icons/Train_Menu_Icons/Station.png',
                text: 'Station',
                menu: 'Train_Tracks'
            },
            {
                id: 3,
                image: './Assets/Nested_Menu_Icons/Train_Menu_Icons/Switch.png',
                text: 'Switch',
                menu: 'Train_Tracks'
            },
            {
                id: 4,
                placeholder: true
            },
            {
                id: 5,
                placeholder: true
            },
            {
                id: 6,
                placeholder: true
            },
            {
                id: 7,
                placeholder: true
            },
            {
                id: 8,
                image: MENU_ICON_PATHS.MAIN + '08_Back.png',
                text: 'Back',
                menu: 'Train_Tracks'
            },
            {
                id: 9,
                placeholder: true
            },
            {
                id: 10,
                placeholder: true
            },
            {
                id: 11,
                placeholder: true
            }
        ]
    },

    Power_Lines: {
        isLeafMenu: true,
        items: [
            {
                id: 0,
                image: './Assets/Nested_Menu_Icons/Nested_Menu_Icons/Template.png',
                text: 'Straight',
                menu: 'Power_Lines'
            },
            {
                id: 1,
                image: './Assets/Nested_Menu_Icons/Template.png',
                text: 'Curve',
                menu: 'Power_Lines'
            },
            {
                id: 2,
                image: './Assets/Nested_Menu_Icons/Template.png',
                text: 'Substation',
                menu: 'Power_Lines'
            },
            {
                id: 3,
                image: './Assets/Nested_Menu_Icons/Template.png',
                text: 'Transformer',
                menu: 'Power_Lines'
            },
            {
                id: 4,
                placeholder: true
            },
            {
                id: 5,
                placeholder: true
            },
            {
                id: 6,
                placeholder: true
            },
            {
                id: 7,
                placeholder: true
            },
            {
                id: 8,
                image: MENU_ICON_PATHS.MAIN + '08_Back.png',
                text: 'Back',
                menu: 'Power_Lines'
            },
            {
                id: 9,
                placeholder: true
            },
            {
                id: 10,
                placeholder: true
            },
            {
                id: 11,
                placeholder: true
            }
        ]
    },

    Pipes: {
        isLeafMenu: true,
        items: [
            {
                id: 0,
                image: './Assets/Nested_Menu_Icons/Nested_Menu_Icons/Template.png',
                text: 'Straight',
                menu: 'Pipes'
            },
            {
                id: 1,
                image: './Assets/Nested_Menu_Icons/Nested_Menu_Icons/Template.png',
                text: 'Curve',
                menu: 'Pipes'
            },
            {
                id: 2,
                image: './Assets/Nested_Menu_Icons/Nested_Menu_Icons/Template.png',
                text: 'Valve',
                menu: 'Pipes'
            },
            {
                id: 3,
                image: './Assets/Nested_Menu_Icons/Nested_Menu_Icons/Template.png',
                text: 'Pump',
                menu: 'Pipes'
            },
            {
                id: 4,
                placeholder: true
            },
            {
                id: 5,
                placeholder: true
            },
            {
                id: 6,
                placeholder: true
            },
            {
                id: 7,
                placeholder: true
            },
            {
                id: 8,
                image: MENU_ICON_PATHS.MAIN + '08_Back.png',
                text: 'Back',
                menu: 'Pipes'
            },
            {
                id: 9,
                placeholder: true
            },
            {
                id: 10,
                placeholder: true
            },
            {
                id: 11,
                placeholder: true
            }
        ]
    }
};
