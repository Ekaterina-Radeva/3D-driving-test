import { Path, Vector3 } from './libs/yuka.module.js'; 
import { Vector3 as Vec3 } from './libs/three.module.js';

const WHITEVEHICLEPATH=[];
const YELLOWVEHICLESPATHS = [];
const REDVEHICLESPATHS = [];
const BLUEVEHICLESPATHS = [];
const GREENVEHICLESPATHS = []; 

// white car path
const whiteV1 = new Path();
whiteV1.add(new Vector3(2, 0.5, -14.5));
WHITEVEHICLEPATH.push(whiteV1);

//green cars paths
const greenV2 = new Path();
greenV2.add(new Vector3(-158, 0.3, -5.5));
greenV2.add(new Vector3(-150, 0.3, -5.2));
greenV2.add(new Vector3(-150, 0.3, -63));
greenV2.add(new Vector3(-180, 0.3, -67));
GREENVEHICLESPATHS.push(greenV2);

const greenV5 = new Path();
greenV5.add(new Vector3(98.3, 0.3, 162));
GREENVEHICLESPATHS.push(greenV5);

// yellow cars paths
const yellowV2 = new Path();
yellowV2.add(new Vector3(-150, 0.3, 1));
yellowV2.add(new Vector3(-150, 0.3, -5.2));
yellowV2.add(new Vector3(-78, 0.3, -5.2));
YELLOWVEHICLESPATHS.push(yellowV2);

const yellowV5 = new Path();
yellowV5.add(new Vector3(90, 0.3, 171.8));
yellowV5.add(new Vector3(158, 0.3, 171.8));
yellowV5.add(new Vector3(164, 0.3, 152));
YELLOWVEHICLESPATHS.push(yellowV5);

const yellowV7= new Path();
yellowV7.add(new Vector3(101.7, 0.3, 389));
yellowV7.add(new Vector3(101.7, 0.3, 500));
YELLOWVEHICLESPATHS.push(yellowV7);

//Red cars paths
const redV2 = new Path();
redV2.add(new Vector3(-152, 0.3, -15));
redV2.add(new Vector3(-152, 0.3, -6));
redV2.add(new Vector3(-78, 0.3, -5.2));
REDVEHICLESPATHS.push(redV2);

const redV5 = new Path();
redV5.add(new Vector3(108, 0.3, 169));
REDVEHICLESPATHS.push(redV5);

const redV6= new Path();
redV6.add(new Vector3(98.5, 0.3, 222));
redV6.add(new Vector3(98.5, 0.3, 272));
redV6.add(new Vector3(47, 0.3, 272));
REDVEHICLESPATHS.push(redV6);

//Blue cars paths
const blueV2 = new Path();
blueV2.add(new Vector3(-143, 0.3, -8.5));
blueV2.add(new Vector3(-222, 0.3, -8.5));
blueV2.add(new Vector3(-222, 0.3, -42));
BLUEVEHICLESPATHS.push(blueV2);

const blueV5 = new Path();
blueV5.add(new Vector3(101, 0.3,178));
BLUEVEHICLESPATHS.push(blueV5);

//questions and answers
const ANSWERSTEXT = [
    {
        question: '1. Какво трябва да предприеме водачът, когато върху арматурното табло свети тизи символ?',
        answer1: 'Blue, yellow, red',
        answer2: 'Red, yellow, blue',
        answer3: 'Red, yellow, blue',
        answer4: 'Red, blue, yellow'
    },
    {
        question: '2. Коя кола трябва да премине първа?',
        answer1: 'зелена',
        answer2: 'червена',
        answer3: 'синя',
        answer4: 'жълта'
    },
    {
        question: '3. С буква а) е означен знакът, който сигнализира, че разстоянието до железопътния прелез е:',
        answer1: '50',
        answer2: '80',
        answer3: '160',
        answer4: '240'
    },
    {
        question: '4. С кой от опознавателните знаци се обзноачават товарните автомобили с допустима максимална маса над 3500 kg и дължина над 7 m?',
        answer1: '1 и 4',
        answer2: '2 и 3',
        answer3: '1 и 2',
        answer4: '3 и 4'
    },
    {
        question: '5. За коя кола положението на тялото на регулировчика е сигнал, значението на който е "Преминаването е разрешено"?',
        answer1: 'синя',
        answer2: 'червена',
        answer3: 'зелена',
        answer4: 'жълта'
    },
    {
        question: 'При заобикаляне на спрелия пред пешеходната пътека автобус:',
        answer1: 'не съм задължен да намалявам скоростта',
        answer2: 'трябва да намаля скоростта и да упрвлявам с готовност за спиране',
        answer3: 'трябва да увелича скоростта си и де премина по възможно най-бързия начин',
        answer4: 'трябва да спра на 1m зад автобуса'
    },
    {
        question: 'Този зелен светлинен сигнал:',
        answer1: 'указва задължителна посока за движение',
        answer2: 'указва място за задължително спиране',
        answer3: 'сигнализира, че навлизането по пътната лента, над която е поставен,е разрешено',
        answer4: 'забранява навлизането в другите пътни ленти'
    }
]

//cars wheels
const WHEELS = {
    whiteCar: {
        frontRight: 'WheelFL6_Mesh_033_M_Rim_NoTint_Max2_1',
        frontLeft: 'WheelFL6_Mesh_033_M_Rim_NoTint_Max1_1',
        back: 'WheelFL6_Mesh_033_M_Rim_NoTint_Max2'
    },
    greenCar: {
        frontRight: 'NormalCar1_FrontRightWheel',
        frontLeft: 'NormalCar1_FrontLeftWheel',
        back: 'NormalCar1_BackWheels'
    },
    yellowCar: {
        frontRight: 'SUV_FrontRightWheel',
        frontLeft: 'SUV_FrontLeftWheel',
        back: 'SUV_BackWheels'
    },
    redCar: {
        frontRight: 'NormalCar1_FrontRightWheel',
        frontLeft: 'NormalCar1_FrontLeftWheel',
        back: 'NormalCar1_BackWheels'
    },
    blueCar: {
        frontRight: 'SportsCar_FrontRightWheel',
        frontLeft: 'SportsCar_FrontLeftWheel',
        back: 'SportsCar_BackWheels'
    }
}

//turn signals(мигачи)
const BLINKINGLIGHTS = {
    green: {
        left: {
            front: new Vec3(0.72, 0.48, 1.86),
            back: new Vec3(0.68, 0.60, -1.80)
        },
        right: {
            front: new Vec3(-0.72, 0.48, 1.86),
            back: new Vec3(-0.68, 0.60, -1.80)
        }
    },
    yellow: {
        left: {
            front: new Vec3(0.83, 0.66, 1.76),
            back: new Vec3(0.76, 0.83, -1.68)
        },
        right: {
            front: new Vec3(-0.83, 0.66, 1.76),
            back: new Vec3(-0.76, 0.83, -1.68)
        }
    },
    red: {
        left: {
            front: new Vec3(0.72, 0.48, 1.86),
            back: new Vec3(0.68, 0.60, -1.80)
        },
        right: {
            front: new Vec3(-0.72, 0.48, 1.86),
            back: new Vec3(-0.68, 0.60, -1.80)
        }
    },
    blue: {
        left: {
            front: new Vec3(0.72, 0.45, 1.64),
            back: new Vec3(0.62, 0.66, -1.68)
        },
        right: {
            front: new Vec3(-0.72, 0.45, 1.64),
            back: new Vec3(-0.62, 0.66, -1.68)
        }
    }
}

//question explanations
const EXPLANATIONS = [
    "Червените знаци светват при потенциален проблем със сигурността и изискват да спрете автомобила възможно най-скоро. Този символ означава предупредителна лампа за налягането на маслото и светва при недостатъчно налягане на маслото или липса на масло в мазилната система.",//1

    "Превозните средства на пътя пропускат първо ППС на пътя с предимство, а те помежду си прилагат правилото за предимството на дясностоящия или ако са едно срещу друго, с предимсто е ППС продължаващо по пътя с предимство.",//2

    "а) означава-железопътния прелез се намира на разстояние от 80m, б)-железопътния прелез се намира на разстояние от 160m и в)-железопътния прелез се намира на разстояние от 240m.",//3

    "Товарни автомобили с допустима максимална маса над 3500 кг и дължина над 7 метра се обозначават с опознавателни знаци във вид на правоъгълни табели, върху които са нанесени успоредни и наклонени червени и жълти (светлоотразителни) ленти. Поставят се отзад на превозното средство. A с жълта правоъгълна табела се обозначават ремаркетата и полуремаркетата.",//4

    "Преминаването(във всички посоки) е разрешено само за жълтата кола, защото стои срещу пуснатото надолу рамото на регулировчика. Забранено е преминаването за автомобилите намиращи се от страната на вдигнатата ръка на регулировчика или срещу и зад него.",//5

    "От автобуса е възможно да слизат пътници, които преминават по пътното платно, затова шофьора трабва да намали скоростта и при неонходимост да спре.",//6

    "Зеленият символ означава, че преминаването по лентата, над която се намира е разрешено, а червеният-че преминаването по нея е забранено."//7
];


export {
    WHITEVEHICLEPATH, 
    GREENVEHICLESPATHS,
    YELLOWVEHICLESPATHS,
    REDVEHICLESPATHS,
    BLUEVEHICLESPATHS,
    ANSWERSTEXT,
    WHEELS,
    BLINKINGLIGHTS,
    EXPLANATIONS
}