// Menu icon path constants
import { PATHS } from './FilePathRouter.js';

const MENU_ICON_PATHS = {
    MAIN: PATHS.ASSETS.MENU_ICONS.MAIN,
    BUILD_OPTIONS: PATHS.ASSETS.MENU_ICONS.BUILD_OPTIONS,
    BUILDINGS: PATHS.ASSETS.MENU_ICONS.BUILDINGS,
    ROAD: PATHS.ASSETS.MENU_ICONS.ROADS,
    TRAIN: './Assets/Nested_Menu_Icons/04_Train_Menu_Icons/',
    TEMPLATE: PATHS.ASSETS.MENU_ICONS.TEMPLATE
};

export const menuItems = {
    Main: {
        isLeafMenu: false,
        items: [
            {
                id: 0,
                image: PATHS.ASSETS.MENU_ICONS.MAIN + '01_Build_Options.png',
                text: 'Build\nOptions',
                menu: 'Main',
                nextMenu: 'Build Options'
            },
            {
                id: 1,
                image: PATHS.ASSETS.MENU_ICONS.MAIN + '02_Generate_Options.png',
                text: 'Generate\nOptions',
                menu: 'Main',
                nextMenu: 'Generate Options'
            },
            {
                id: 2,
                image: PATHS.ASSETS.MENU_ICONS.MAIN + '03_Population_Options.png',
                text: 'Population\nOptions',
                menu: 'Main',
                nextMenu: 'Population_Options'
            },
            {
                id: 3,
                placeholder: true
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
                image: PATHS.ASSETS.MENU_ICONS.MAIN + '08_Back.png',
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

    'Build Options': {
        isLeafMenu: false,
        items: [
            {
                id: 0,
                image: PATHS.ASSETS.MENU_ICONS.BUILD_OPTIONS + '01_Buildings.png',
                text: 'Buildings',
                menu: 'Build Options',
                nextMenu: 'Buildings'
            },
            {
                id: 1,
                image: PATHS.ASSETS.MENU_ICONS.BUILD_OPTIONS + '02_Roads.png',
                text: 'Roads',
                menu: 'Build Options',
                nextMenu: 'Roads'
            },
            {
                id: 2,
                image: PATHS.ASSETS.MENU_ICONS.BUILD_OPTIONS + '03_Train_Tracks.png',
                text: 'Train\nTracks',
                menu: 'Build Options'
            },
            {
                id: 3,
                image: PATHS.ASSETS.MENU_ICONS.BUILD_OPTIONS + '04_Power_Lines.png',
                text: 'Power\nLines',
                menu: 'Build Options'
            },
            {
                id: 4,
                image: PATHS.ASSETS.MENU_ICONS.BUILD_OPTIONS + '05_Pipes.png',
                text: 'Pipes',
                menu: 'Build Options'
            },
            {
                id: 5,
                image: PATHS.ASSETS.MENU_ICONS.BUILD_OPTIONS + '06_Fauna.png',
                text: 'Fauna',
                menu: 'Build Options'
            },
            {
                id: 6,
                image: PATHS.ASSETS.MENU_ICONS.BUILD_OPTIONS + '07_Flora.png',
                text: 'Flora',
                menu: 'Build Options'
            },
            {
                id: 7,
                placeholder: true
            },
            {
                id: 8,
                image: PATHS.ASSETS.MENU_ICONS.MAIN + '08_Back.png',
                text: 'Back',
                menu: 'Build Options'
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
                image: PATHS.ASSETS.MENU_ICONS.BUILD_OPTIONS + '11_Destroy.png',
                text: 'Destroy',
                menu: 'Build Options'
            }
        ]
    },
    
    Roads: {
        isLeafMenu: true,
        items: [
            {
                id: 0,
                image: PATHS.ASSETS.MENU_ICONS.ROADS + '01_Cross.png',
                text: 'Cross',
                menu: 'Roads'
            },
            {
                id: 1,
                image: PATHS.ASSETS.MENU_ICONS.ROADS + '02_Straight.png',
                text: 'Straight',
                menu: 'Roads'
            },
            {
                id: 2,
                image: PATHS.ASSETS.MENU_ICONS.ROADS + '03_T.png',
                text: 'T',
                menu: 'Roads'
            },
            {
                id: 3,
                image: PATHS.ASSETS.MENU_ICONS.ROADS + '04_L.png',
                text: 'L',
                menu: 'Roads'
            },
            {
                id: 4,
                image: PATHS.ASSETS.MENU_ICONS.ROADS + '05_Diagonal.png',
                text: 'Diagonal',
                menu: 'Roads'
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
                image: PATHS.ASSETS.MENU_ICONS.MAIN + '08_Back.png',
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
                image: PATHS.ASSETS.MENU_ICONS.BUILDINGS + '01_Power_Plant.png',
                text: 'Power\nStation',
                menu: 'Buildings',
                tileType: 'Power_Plant'
            },
            {
                id: 1,
                image: PATHS.ASSETS.MENU_ICONS.BUILDINGS + '02_Factorum.png',
                text: 'Steel\nFoundry',
                menu: 'Buildings',
                tileType: 'Factorum'
            },
            {
                id: 2,
                image: PATHS.ASSETS.MENU_ICONS.BUILDINGS + '03_Chem_Plant.png',
                text: 'Chemical\nPlant',
                menu: 'Buildings',
                tileType: 'Chemical_Plant'
            },
            {
                id: 3,
                image: PATHS.ASSETS.MENU_ICONS.BUILDINGS + '04_Train_Station.png',
                text: 'Train\nStation',
                menu: 'Buildings',
                tileType: 'Train_Station'
            },
            {
                id: 4,
                image: PATHS.ASSETS.MENU_ICONS.BUILDINGS + '05_Promethium_Refinery.png',
                text: 'Oil\nRefinery',
                menu: 'Buildings',
                tileType: 'Promethium_Refinery'
            },
            {
                id: 5,
                image: PATHS.ASSETS.MENU_ICONS.BUILDINGS + '06_Hab_Block.png',
                text: 'Apartment\nBlock',
                menu: 'Buildings',
                tileType: 'Hab_Block'
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
                image: PATHS.ASSETS.MENU_ICONS.MAIN + '08_Back.png',
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
                placeholder: true
            },
            {
                id: 1,
                placeholder: true
            },
            {
                id: 2,
                placeholder: true
            },
            {
                id: 3,
                placeholder: true
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
                image: PATHS.ASSETS.MENU_ICONS.MAIN + '08_Back.png',
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
                placeholder: true
            },
            {
                id: 1,
                placeholder: true
            },
            {
                id: 2,
                placeholder: true
            },
            {
                id: 3,
                placeholder: true
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
                image: PATHS.ASSETS.MENU_ICONS.MAIN + '08_Back.png',
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
                placeholder: true
            },
            {
                id: 1,
                placeholder: true
            },
            {
                id: 2,
                placeholder: true
            },
            {
                id: 3,
                placeholder: true
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
                image: PATHS.ASSETS.MENU_ICONS.MAIN + '08_Back.png',
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
    },

    'Generate Options': {
        isLeafMenu: false,
        items: [
            {
                id: 0,
                image: PATHS.ASSETS.MENU_ICONS.GENERATE_OPTIONS + '01_Generate.png',
                text: 'Generate',
                menu: 'Generate Options',
                action: 'generate'
            },
            {
                id: 1,
                image: PATHS.ASSETS.MENU_ICONS.GENERATE_OPTIONS + '02_Adjust_Weights.png',
                text: 'Adjust\nWeights',
                menu: 'Generate Options',
                action: 'weights'
            },
            {
                id: 2,
                image: PATHS.ASSETS.MENU_ICONS.GENERATE_OPTIONS + '03_Undo.png',
                text: 'Undo',
                menu: 'Generate Options',
                action: 'undo'
            },
            {
                id: 3,
                image: PATHS.ASSETS.MENU_ICONS.GENERATE_OPTIONS + '04_Visualise_Process.png',
                text: 'Visualise\nProcess',
                menu: 'Generate Options',
                nextMenu: 'Visualise Generation Process'
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
                image: PATHS.ASSETS.MENU_ICONS.MAIN + '08_Back.png',
                text: 'Back',
                menu: 'Generate Options'
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

    'Visualise Generation Process': {
        isLeafMenu: false,
        items: [
            {
                id: 0,
                image: PATHS.ASSETS.MENU_ICONS.VISUALISATION_OPTIONS + '01_Step_Back.png',
                text: 'Step\nBack',
                menu: 'Visualise Generation Process',
                action: 'step_back'
            },
            {
                id: 1,
                image: PATHS.ASSETS.MENU_ICONS.VISUALISATION_OPTIONS + '02_Play.png',
                text: 'Play',
                menu: 'Visualise Generation Process',
                action: 'play'
            },
            {
                id: 2,
                image: PATHS.ASSETS.MENU_ICONS.VISUALISATION_OPTIONS + '03_Pause.png',
                text: 'Pause',
                menu: 'Visualise Generation Process',
                action: 'pause'
            },
            {
                id: 3,
                image: PATHS.ASSETS.MENU_ICONS.VISUALISATION_OPTIONS + '04_Step_Forward.png',
                text: 'Step\nForward',
                menu: 'Visualise Generation Process',
                action: 'step_forward'
            },
            {
                id: 4,
                text: 'Play\nSpeed',
                image: PATHS.ASSETS.MENU_ICONS.VISUALISATION_OPTIONS + '05_Play_Speed.png',
                menu: 'Visualise Generation Process',
                action: 'play_speed'
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
                image: PATHS.ASSETS.MENU_ICONS.MAIN + '08_Back.png',
                text: 'Back',
                menu: 'Visualise Generation Process'
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
