/**
 * Utilities for translating dynamic content from Supabase
 */

// Types for meditation and routine data
interface MeditationData {
  id: string;
  title: string;
  duration: string;
  url: string;
  fileName: string;
  size: number;
  lastModified?: string;
  type: 'video' | 'audio';
}

interface RoutineData {
  id: string;
  title: string;
  content?: string;
  duration: string;
  episode?: string;
  day: string;
  exercise?: string;
  pro_tip?: string;
  'areas-improve'?: string;
  'rings-placement'?: string;
}

// Translation mappings for routine titles and content
const ROUTINE_TRANSLATIONS: Record<string, { en: string; es: string }> = {
  // Day patterns
  'Day 1': { en: 'Day 1', es: 'Día 1' },
  'Day 2': { en: 'Day 2', es: 'Día 2' },
  'Day 3': { en: 'Day 3', es: 'Día 3' },
  'Day 4': { en: 'Day 4', es: 'Día 4' },
  'Day 5': { en: 'Day 5', es: 'Día 5' },
  'Day 6': { en: 'Day 6', es: 'Día 6' },
  'Day 7': { en: 'Day 7', es: 'Día 7' },
  'Day 8': { en: 'Day 8', es: 'Día 8' },
  'Day 9': { en: 'Day 9', es: 'Día 9' },
  'Day 10': { en: 'Day 10', es: 'Día 10' },
  'Day 11': { en: 'Day 11', es: 'Día 11' },
  'Day 12': { en: 'Day 12', es: 'Día 12' },
  'Day 13': { en: 'Day 13', es: 'Día 13' },
  'Day 14': { en: 'Day 14', es: 'Día 14' },
  'Day 15': { en: 'Day 15', es: 'Día 15' },
  'Day 16': { en: 'Day 16', es: 'Día 16' },
  'Day 17': { en: 'Day 17', es: 'Día 17' },
  'Day 18': { en: 'Day 18', es: 'Día 18' },
  'Day 19': { en: 'Day 19', es: 'Día 19' },
  'Day 20': { en: 'Day 20', es: 'Día 20' },
  'Day 21': { en: 'Day 21', es: 'Día 21' },
  'Day 22': { en: 'Day 22', es: 'Día 22' },
  'Day 23': { en: 'Day 23', es: 'Día 23' },
  'Day 24': { en: 'Day 24', es: 'Día 24' },

  // Week patterns
  'Week 1': { en: 'Week 1', es: 'Semana 1' },
  'Week 2': { en: 'Week 2', es: 'Semana 2' },
  'Week 3': { en: 'Week 3', es: 'Semana 3' },
  'Week 4': { en: 'Week 4', es: 'Semana 4' },

  // Routine Titles - Complete translations from the data
  'FULL BODY #1': { en: 'FULL BODY #1', es: 'CUERPO COMPLETO #1' },
  'LEGS & GLUTE #2': { en: 'LEGS & GLUTE #2', es: 'PIERNAS Y GLÚTEOS #2' },
  'UPPER BODY #3': { en: 'UPPER BODY #3', es: 'TREN SUPERIOR #3' },
  'MOBILITY #4': { en: 'MOBILITY #4', es: 'MOVILIDAD #4' },
  'CARDIO #5': { en: 'CARDIO #5', es: 'CARDIO #5' },
  'MOBILITY #6': { en: 'MOBILITY #6', es: 'MOVILIDAD #6' },
  'FULL BODY #7': { en: 'FULL BODY #7', es: 'CUERPO COMPLETO #7' },
  'ABS #8': { en: 'ABS #8', es: 'ABDOMINALES #8' },
  'UPPER BODY #9': { en: 'UPPER BODY #9', es: 'TREN SUPERIOR #9' },
  'MOBILITY #10': { en: 'MOBILITY #10', es: 'MOVILIDAD #10' },
  'CARDIO #11': { en: 'CARDIO #11', es: 'CARDIO #11' },
  'MOBILITY #12': { en: 'MOBILITY #12', es: 'MOVILIDAD #12' },
  'MOBILITY #13': { en: 'MOBILITY #13', es: 'MOVILIDAD #13' },
  'ABS #14': { en: 'ABS #14', es: 'ABDOMINALES #14' },
  'LOWER BODY #15': { en: 'LOWER BODY #15', es: 'TREN INFERIOR #15' },
  'COMBO #16': { en: 'COMBO #16', es: 'COMBO #16' },
  'GLUTE, LEGS #17': { en: 'GLUTE, LEGS #17', es: 'GLÚTEOS, PIERNAS #17' },
  'MOBILITY #18': { en: 'MOBILITY #18', es: 'MOVILIDAD #18' },
  'ABS #19': { en: 'ABS #19', es: 'ABDOMINALES #19' },
  'FULL BODY #20': { en: 'FULL BODY #20', es: 'CUERPO COMPLETO #20' },
  'GLUTE, LEGS #21': { en: 'GLUTE, LEGS #21', es: 'GLÚTEOS, PIERNAS #21' },
  'FULL BODY #22': { en: 'FULL BODY #22', es: 'CUERPO COMPLETO #22' },
  'UPPER BODY #23': { en: 'UPPER BODY #23', es: 'TREN SUPERIOR #23' },
  'MOBILITY #24': { en: 'MOBILITY #24', es: 'MOVILIDAD #24' },

  // Exercise names
  'Squat': { en: 'Squat', es: 'Sentadilla' },
  'Row': { en: 'Row', es: 'Remo' },
  'Abs Rising Legs': { en: 'Abs Rising Legs', es: 'Abdominales Elevando Piernas' },
  'Glute Kickback Right': { en: 'Glute Kickback Right', es: 'Patada de Glúteo Derecha' },
  'Glute Kickback Left': { en: 'Glute Kickback Left', es: 'Patada de Glúteo Izquierda' },
  'Sumo Squat': { en: 'Sumo Squat', es: 'Sentadilla Sumo' },
  'Lunge Looking Forward': { en: 'Lunge Looking Forward', es: 'Zancada Mirando al Frente' },
  'Squat + Lift the leg opposite ring': { en: 'Squat + Lift the leg opposite ring', es: 'Sentadilla + Elevar la pierna opuesta al anillo' },
  'Low Squat Change Leg': { en: 'Low Squat Change Leg', es: 'Sentadilla Baja Cambiar Pierna' },
  'Rings Bridge': { en: 'Rings Bridge', es: 'Puente con Anillas' },
  'Assisted Pull Up': { en: 'Assisted Pull Up', es: 'Dominada Asistida' },
  'One Arm Inverse Rollout': { en: 'One Arm Inverse Rollout', es: 'Rollout Inverso de Un Brazo' },
  'Inclined Push Up Triceps': { en: 'Inclined Push Up Triceps', es: 'Flexiones Inclinadas de Tríceps' },
  'Bicep Curl': { en: 'Bicep Curl', es: 'Curl de Bíceps' },
  'Row Openarms': { en: 'Row Openarms', es: 'Remo Brazos Abiertos' },
  'Scapula Up Down': { en: 'Scapula Up Down', es: 'Escápulas Arriba Abajo' },
  'Hips Mobility Open chest': { en: 'Hips Mobility Open chest', es: 'Movilidad de Cadera Pecho Abierto' },
  'Hips Mobility Rotation': { en: 'Hips Mobility Rotation', es: 'Movilidad de Cadera Rotación' },
  'Wave': { en: 'Wave', es: 'Onda' },
  'Boxer': { en: 'Boxer', es: 'Boxeador' },
  'Running Hands Over Head': { en: 'Running Hands Over Head', es: 'Correr Manos Sobre la Cabeza' },
  'Jumping Jacks': { en: 'Jumping Jacks', es: 'Saltos de Tijera' },
  'Inclined Runner': { en: 'Inclined Runner', es: 'Corredor Inclinado' },
  'Hills Up': { en: 'Hills Up', es: 'Subir Colinas' },
  'Mini Muscle Up': { en: 'Mini Muscle Up', es: 'Mini Muscle Up' },
  'Mountain Climber': { en: 'Mountain Climber', es: 'Escalador de Montaña' },
  'ABS crunch 1+1': { en: 'ABS crunch 1+1', es: 'Abdominales crunch 1+1' },
  'Gravity Pull Up': { en: 'Gravity Pull Up', es: 'Dominada con Gravedad' },
  'Open/Close Straight Leg Right': { en: 'Open/Close Straight Leg Right', es: 'Abrir/Cerrar Pierna Recta Derecha' },
  'Open/Close Straight Leg Left': { en: 'Open/Close Straight Leg Left', es: 'Abrir/Cerrar Pierna Recta Izquierda' },
  'Abs con empuje (v)': { en: 'Abs con empuje (v)', es: 'Abdominales con empuje (v)' },
  'Bicycle Abs': { en: 'Bicycle Abs', es: 'Abdominales Bicicleta' },
  'Roll back and foward': { en: 'Roll back and foward', es: 'Rodar hacia atrás y adelante' },
  'Abs crunch + Extension': { en: 'Abs crunch + Extension', es: 'Abdominales crunch + Extensión' },
  'ABS one leg at the time': { en: 'ABS one leg at the time', es: 'Abdominales una pierna a la vez' },
  'Assisted Dip': { en: 'Assisted Dip', es: 'Fondo Asistido' },
  'Alternating Biceps Curl': { en: 'Alternating Biceps Curl', es: 'Curl de Bíceps Alternado' },
  'Triceps Curls': { en: 'Triceps Curls', es: 'Curl de Tríceps' },
  'Rings to Chest': { en: 'Rings to Chest', es: 'Anillas al Pecho' },
  'Row open arms': { en: 'Row open arms', es: 'Remo brazos abiertos' },
  'forward waves': { en: 'forward waves', es: 'ondas hacia adelante' },
  'overhead rotation': { en: 'overhead rotation', es: 'rotación por encima' },
  'Side rotation right': { en: 'Side rotation right', es: 'Rotación lateral derecha' },
  'Side rotation left': { en: 'Side rotation left', es: 'Rotación lateral izquierda' },
  'Lunge open chest': { en: 'Lunge open chest', es: 'Zancada pecho abierto' },
  'squat Jump': { en: 'squat Jump', es: 'Sentadilla con Salto' },
  'Croll Swimmer': { en: 'Croll Swimmer', es: 'Crol Nadador' },
  'Vertical Jump': { en: 'Vertical Jump', es: 'Salto Vertical' },
  'Chest swimmer': { en: 'Chest swimmer', es: 'Nadador de pecho' },
  'rollout to KNEE IN THE FRONT': { en: 'rollout to KNEE IN THE FRONT', es: 'rollout hasta RODILLA AL FRENTE' },
  'Streatching left leg': { en: 'Streatching left leg', es: 'Estiramiento pierna izquierda' },
  'Streatching right leg': { en: 'Streatching right leg', es: 'Estiramiento pierna derecha' },
  'Sumo squat full rotatiton': { en: 'Sumo squat full rotatiton', es: 'Sentadilla sumo rotación completa' },
  'Kneing Rotation': { en: 'Kneing Rotation', es: 'Rotación de Rodillas' },
  'Forward fold': { en: 'Forward fold', es: 'Flexión hacia adelante' },

  // Ring placement terms
  'UNDER THE HIP': { en: 'UNDER THE HIP', es: 'BAJO LA CADERA' },
  'OVER THE KNEE': { en: 'OVER THE KNEE', es: 'SOBRE LA RODILLA' },
  'CHEST': { en: 'CHEST', es: 'PECHO' },
  'Just The Rings': { en: 'Just The Rings', es: 'Solo Las Anillas' },
  'NECK (Sitting on the floor)': { en: 'NECK (Sitting on the floor)', es: 'CUELLO (Sentado en el suelo)' },
  'Over the hip': { en: 'Over the hip', es: 'Sobre la cadera' },
  'Hip': { en: 'Hip', es: 'Cadera' },
  'Over head': { en: 'Over head', es: 'Sobre la cabeza' },

  // Body parts and areas
  'Lower Body': { en: 'Lower Body', es: 'Tren Inferior' },
  'Upper Body': { en: 'Upper Body', es: 'Tren Superior' },
  'Glutes': { en: 'Glutes', es: 'Glúteos' },
  'Quads': { en: 'Quads', es: 'Cuádriceps' },
  'Hamstrings': { en: 'Hamstrings', es: 'Isquiotibiales' },
  'Upper back': { en: 'Upper back', es: 'Espalda alta' },
  'Triceps': { en: 'Triceps', es: 'Tríceps' },
  'Shoulders': { en: 'Shoulders', es: 'Hombros' },
  'Biceps': { en: 'Biceps', es: 'Bíceps' },
  'Core': { en: 'Core', es: 'Core' },
  'CORE': { en: 'CORE', es: 'CORE' },
  'Hips': { en: 'Hips', es: 'Caderas' },
  'Calves': { en: 'Calves', es: 'Pantorrillas' },
  'Hip abductors': { en: 'Hip abductors', es: 'Abductores de cadera' },
  'Hip abductor': { en: 'Hip abductor', es: 'Abductor de cadera' },
  'Hip Abductor': { en: 'Hip Abductor', es: 'Abductor de Cadera' },
  'Hip Adductor': { en: 'Hip Adductor', es: 'Aductor de Cadera' },
  'Hip Adductors': { en: 'Hip Adductors', es: 'Aductores de Cadera' },
  'Deltoids': { en: 'Deltoids', es: 'Deltoides' },
  'Rhomboid': { en: 'Rhomboid', es: 'Romboide' },
  'Trapezius': { en: 'Trapezius', es: 'Trapecio' },
  'Trapeze': { en: 'Trapeze', es: 'Trapecio' },
  'Serratus': { en: 'Serratus', es: 'Serrato' },
  'Spine': { en: 'Spine', es: 'Columna' },
  'Lower back': { en: 'Lower back', es: 'Espalda baja' },
  'Knees': { en: 'Knees', es: 'Rodillas' },
  'Chest': { en: 'Chest', es: 'Pecho' },
  'Neck': { en: 'Neck', es: 'Cuello' },
  'Feet': { en: 'Feet', es: 'Pies' },
  'Back': { en: 'Back', es: 'Espalda' },

  // Actions and movements
  'Rotation': { en: 'Rotation', es: 'Rotación' },
  'Extension': { en: 'Extension', es: 'Extensión' },
  'Flexion': { en: 'Flexion', es: 'Flexión' },
  'Contraction': { en: 'Contraction', es: 'Contracción' },
  'Lateral Extension': { en: 'Lateral Extension', es: 'Extensión Lateral' },

  // Duration patterns
  '5 min': { en: '5 min', es: '5 min' },
  '10 min': { en: '10 min', es: '10 min' },
  '15 min': { en: '15 min', es: '15 min' },
  '15 Min': { en: '15 Min', es: '15 Min' },
  '20 min': { en: '20 min', es: '20 min' },
  '25 min': { en: '25 min', es: '25 min' },
  '30 min': { en: '30 min', es: '30 min' },

  // Pro tip complete sentences
  'Feet point outward, as do the knees.': { en: 'Feet point outward, as do the knees.', es: 'Los pies apuntan hacia afuera, al igual que las rodillas.' },
  'Keep the tension all the time on the straps.': { en: 'Keep the tension all the time on the straps.', es: 'Mantén la tensión todo el tiempo en las correas.' },
  "It's possible to use your arms for assistance and stabilization.": { en: "It's possible to use your arms for assistance and stabilization.", es: 'Es posible usar los brazos para asistencia y estabilización.' },
  'Knees and elbows remain at 90 degrees for as much time as possible.': { en: 'Knees and elbows remain at 90 degrees for as much time as possible.', es: 'Las rodillas y los codos permanecen a 90 grados el mayor tiempo posible.' },
  'Modify my body position to change the intensity.': { en: 'Modify my body position to change the intensity.', es: 'Modifica la posición del cuerpo para cambiar la intensidad.' },
  
  // Pro tip completo para LEGS & GLUTE #2
  '* Feet point outward, as do the knees.\n* Keep the tension all the time on the straps.\n*It\'s possible to use your arms for assistance and stabilization.\n*Knees and elbows remain at 90 degrees for as much time as possible.\n* Modify my body position to change the intensity.': {
    en: '* Feet point outward, as do the knees.\n* Keep the tension all the time on the straps.\n*It\'s possible to use your arms for assistance and stabilization.\n*Knees and elbows remain at 90 degrees for as much time as possible.\n* Modify my body position to change the intensity.',
    es: '* Los pies apuntan hacia afuera, al igual que las rodillas.\n* Mantén la tensión todo el tiempo en las correas.\n* Es posible usar los brazos para asistencia y estabilización.\n* Las rodillas y los codos permanecen a 90 grados el mayor tiempo posible.\n* Modifica la posición del cuerpo para cambiar la intensidad.'
  },
  
  'Keep the elbows straight': { en: 'Keep the elbows straight', es: 'Mantén los codos rectos' },
  "Keep body straight, Don't lead with your stomach.": { en: "Keep body straight, Don't lead with your stomach.", es: 'Mantén el cuerpo recto, no lideres con el estómago.' },
  'Scapulas off the floor for this exercise.': { en: 'Scapulas off the floor for this exercise.', es: 'Escápulas fuera del suelo para este ejercicio.' },
  'Keep your torso low and drive your heel toward the ceiling, with your supporting knee slightly bent.': { en: 'Keep your torso low and drive your heel toward the ceiling, with your supporting knee slightly bent.', es: 'Mantén el torso bajo y empuja el talón hacia el techo, con la rodilla de apoyo ligeramente flexionada.' },

  // Common pro tip words that often appear
  'feet': { en: 'feet', es: 'pies' },
  'knees': { en: 'knees', es: 'rodillas' },
  'elbows': { en: 'elbows', es: 'codos' },
  'arms': { en: 'arms', es: 'brazos' },
  'body': { en: 'body', es: 'cuerpo' },
  'position': { en: 'position', es: 'posición' },
  'intensity': { en: 'intensity', es: 'intensidad' },
  'tension': { en: 'tension', es: 'tensión' },
  'straps': { en: 'straps', es: 'correas' },
  'assistance': { en: 'assistance', es: 'asistencia' },
  'stabilization': { en: 'stabilization', es: 'estabilización' },
  'degrees': { en: 'degrees', es: 'grados' },
  'straight': { en: 'straight', es: 'recto' },
  'floor': { en: 'floor', es: 'suelo' },
  'exercise': { en: 'exercise', es: 'ejercicio' },
  'torso': { en: 'torso', es: 'torso' },
  'heel': { en: 'heel', es: 'talón' },
  'ceiling': { en: 'ceiling', es: 'techo' },
  'supporting': { en: 'supporting', es: 'de apoyo' },
  'slightly': { en: 'slightly', es: 'ligeramente' },
  'bent': { en: 'bent', es: 'flexionada' }
};

// Translation mappings for complete pro tips
const PRO_TIP_TRANSLATIONS: Record<string, { en: string; es: string }> = {
  // Day 1
  "* Keep the elbows straight\n* Keep body straight, Don't lead with your stomach.\n* Scapulas off the floor for this exercise.\n*Keep your torso low and drive your heel toward the ceiling, with your supporting knee slightly bent.": {
    en: "* Keep the elbows straight\n* Keep body straight, Don't lead with your stomach.\n* Scapulas off the floor for this exercise.\n*Keep your torso low and drive your heel toward the ceiling, with your supporting knee slightly bent.",
    es: "* Mantén los codos rectos\n* Mantén el cuerpo recto, no lideres con el estómago.\n* Escápulas fuera del suelo para este ejercicio.\n* Mantén el torso bajo y empuja el talón hacia el techo, con la rodilla de apoyo ligeramente flexionada."
  },
  
  // Day 2
  "* Feet point outward, as do the knees.\n* Keep the tension all the time on the straps.\n*It's possible to use your arms for assistance and stabilization.\n*Knees and elbows remain at 90 degrees for as much time as possible.\n* Modify my body position to change the intensity.": {
    en: "* Feet point outward, as do the knees.\n* Keep the tension all the time on the straps.\n*It's possible to use your arms for assistance and stabilization.\n*Knees and elbows remain at 90 degrees for as much time as possible.\n* Modify my body position to change the intensity.",
    es: "* Los pies apuntan hacia afuera, al igual que las rodillas.\n* Mantén la tensión todo el tiempo en las correas.\n* Es posible usar los brazos para asistencia y estabilización.\n* Las rodillas y codos permanecen a 90 grados el mayor tiempo posible.\n* Modifica la posición del cuerpo para cambiar la intensidad."
  },
  
  // Day 3
  "* First pull with your arms, then push with your legs.\n*Both arms apply the same amount of force; do not change your posture.\n* do not change your posture. Keep elbows high\n* Keep elbows high\n* do not change your posture. Keep elbows high": {
    en: "* First pull with your arms, then push with your legs.\n*Both arms apply the same amount of force; do not change your posture.\n* do not change your posture. Keep elbows high\n* Keep elbows high\n* do not change your posture. Keep elbows high",
    es: "* Primero tira con los brazos, luego empuja con las piernas.\n* Ambos brazos aplican la misma cantidad de fuerza; no cambies tu postura.\n* No cambies tu postura. Mantén los codos altos\n* Mantén los codos altos\n* No cambies tu postura. Mantén los codos altos"
  },
  
  // Day 4
  "*control your breathing in each movement": {
    en: "*control your breathing in each movement",
    es: "* Controla tu respiración en cada movimiento"
  },
  
  // Day 5
  "* Keep the tension all the time on the straps.": {
    en: "* Keep the tension all the time on the straps.",
    es: "* Mantén la tensión todo el tiempo en las correas."
  },
  
  // Day 6
  "*Guide the movement with the breathing and reach the full range of motion ": {
    en: "*Guide the movement with the breathing and reach the full range of motion ",
    es: "* Guía el movimiento con la respiración y alcanza el rango completo de movimiento"
  },
  
  // Day 7
  "*Keep the same pace throughout the entire routine; the angle of your body will determine the difficulty. ": {
    en: "*Keep the same pace throughout the entire routine; the angle of your body will determine the difficulty. ",
    es: "* Mantén el mismo ritmo durante toda la rutina; el ángulo de tu cuerpo determinará la dificultad."
  },
  
  // Day 8
  "* In each exercise, you should find the correct traction on the rings, and always maintain downward pressure.": {
    en: "* In each exercise, you should find the correct traction on the rings, and always maintain downward pressure.",
    es: "* En cada ejercicio, debes encontrar la tracción correcta en las anillas y siempre mantener presión hacia abajo."
  },
  
  // Day 9
  "* Manage the intensity and number of exercises, and maintain proper posture at all times.": {
    en: "* Manage the intensity and number of exercises, and maintain proper posture at all times.",
    es: "* Gestiona la intensidad y número de ejercicios, y mantén una postura correcta en todo momento."
  },
  
  // Day 11
  "* Find an appropriate intensity in the first round, try to surpass yourself in the second and third rounds, and always keep downward pressure on the rings.": {
    en: "* Find an appropriate intensity in the first round, try to surpass yourself in the second and third rounds, and always keep downward pressure on the rings.",
    es: "* Encuentra una intensidad apropiada en la primera ronda, trata de superarte en la segunda y tercera ronda, y siempre mantén presión hacia abajo en las anillas."
  },
  
  // Day 14
  "*Find the correct inclination for each exercise, and use the rings for assistance as much as possible.": {
    en: "*Find the correct inclination for each exercise, and use the rings for assistance as much as possible.",
    es: "* Encuentra la inclinación correcta para cada ejercicio y usa las anillas para asistencia tanto como sea posible."
  },
  
  // Day 15
  "* Use a solid base of support; these exercises are for the lower body—the arms only assist the movement.": {
    en: "* Use a solid base of support; these exercises are for the lower body—the arms only assist the movement.",
    es: "* Usa una base sólida de apoyo; estos ejercicios son para el tren inferior—los brazos solo asisten el movimiento."
  },
  
  // Day 16
  "*These exercises are performed as a combo—aim to complete one movement before starting the next. In the first exercise, the chest and legs apply equal force. In the second, lower yourself slowly in the pistol squat. In the third, focus on keeping your arms behind your head during the squat.": {
    en: "*These exercises are performed as a combo—aim to complete one movement before starting the next. In the first exercise, the chest and legs apply equal force. In the second, lower yourself slowly in the pistol squat. In the third, focus on keeping your arms behind your head during the squat.",
    es: "* Estos ejercicios se realizan como un combo—busca completar un movimiento antes de comenzar el siguiente. En el primer ejercicio, el pecho y las piernas aplican igual fuerza. En el segundo, bájate lentamente en la sentadilla pistol. En el tercero, enfócate en mantener tus brazos detrás de la cabeza durante la sentadilla."
  },
  
  // Day 17
  "* Always try to maintain a slight bend in your hips and knees.": {
    en: "* Always try to maintain a slight bend in your hips and knees.",
    es: "* Siempre trata de mantener una ligera flexión en tus caderas y rodillas."
  },
  
  // Day 19
  "*Your shoulder blades should lift off the floor; use your arms to assist or maintain tension.": {
    en: "*Your shoulder blades should lift off the floor; use your arms to assist or maintain tension.",
    es: "* Tus escápulas deben levantarse del suelo; usa tus brazos para asistir o mantener tensión."
  },
  
  // Day 20
  "* Always move through the full range of motion. In the second exercise, keep your elbows straight and your hands in supination; when rotating outward, perform the exercises in a controlled manner during the roll back.": {
    en: "* Always move through the full range of motion. In the second exercise, keep your elbows straight and your hands in supination; when rotating outward, perform the exercises in a controlled manner during the roll back.",
    es: "* Siempre muévete a través del rango completo de movimiento. En el segundo ejercicio, mantén los codos rectos y las manos en supinación; al rotar hacia afuera, realiza los ejercicios de manera controlada durante el roll back."
  },
  
  // Day 21
  "* Control the entire exercise to match your level. The angle of your body will determine the difficulty.": {
    en: "* Control the entire exercise to match your level. The angle of your body will determine the difficulty.",
    es: "* Controla todo el ejercicio para que coincida con tu nivel. El ángulo de tu cuerpo determinará la dificultad."
  },
  
  // Day 22
  "*The angle of your body will determine the difficulty; in these exercises, make sure your body is positioned above the rings. Keep your elbows straight and rotated outward (supinated).": {
    en: "*The angle of your body will determine the difficulty; in these exercises, make sure your body is positioned above the rings. Keep your elbows straight and rotated outward (supinated).",
    es: "* El ángulo de tu cuerpo determinará la dificultad; en estos ejercicios, asegúrate de que tu cuerpo esté posicionado sobre las anillas. Mantén los codos rectos y rotados hacia afuera (supinados)."
  },
  
  // Day 23
  "* This is the last exercise of the challenge. Try to set the rings at a height where, when you lift your legs, you can hang freely. The idea is to have fun, so give it a try!": {
    en: "* This is the last exercise of the challenge. Try to set the rings at a height where, when you lift your legs, you can hang freely. The idea is to have fun, so give it a try!",
    es: "* Este es el último ejercicio del desafío. Trata de colocar las anillas a una altura donde, cuando levantes las piernas, puedas colgarte libremente. La idea es divertirse, ¡así que inténtalo!"
  },
  
  // Day 24
  "*Guide the movement with the breathing and reach the full range of motion": {
    en: "*Guide the movement with the breathing and reach the full range of motion",
    es: "* Guía el movimiento con la respiración y alcanza el rango completo de movimiento"
  }
};

/**
 * Translates a routine's day field (e.g., "Day 1" -> "Día 1")
 */
export function translateDay(day: string, locale: 'en' | 'es'): string {
  if (!day) return day;
  
  // Try exact match first
  if (ROUTINE_TRANSLATIONS[day]) {
    return ROUTINE_TRANSLATIONS[day][locale];
  }
  
  // Try pattern matching for day numbers
  const dayMatch = day.match(/Day (\d+)/i);
  if (dayMatch) {
    const dayNumber = dayMatch[1];
    return locale === 'es' ? `Día ${dayNumber}` : `Day ${dayNumber}`;
  }
  
  // Try pattern matching for week numbers
  const weekMatch = day.match(/Week (\d+)/i);
  if (weekMatch) {
    const weekNumber = weekMatch[1];
    return locale === 'es' ? `Semana ${weekNumber}` : `Week ${weekNumber}`;
  }
  
  return day; // Return original if no translation found
}

/**
 * Translates routine title based on common patterns
 */
export function translateRoutineTitle(title: string, locale: 'en' | 'es'): string {
  if (!title) return title;
  
  // Clean title (trim whitespace)
  const cleanTitle = title.trim();
  
  // Try exact match first
  if (ROUTINE_TRANSLATIONS[cleanTitle]) {
    return ROUTINE_TRANSLATIONS[cleanTitle][locale];
  }
  
  // Try case-insensitive match
  const titleEntry = Object.entries(ROUTINE_TRANSLATIONS).find(
    ([key]) => key.toLowerCase() === cleanTitle.toLowerCase()
  );
  
  if (titleEntry) {
    return titleEntry[1][locale];
  }
  
  // For debugging - log untranslated titles
  console.log(`🔍 No translation found for routine title: "${title}" (cleaned: "${cleanTitle}")`);
  
  return title;
}

/**
 * Translates duration text
 */
export function translateDuration(duration: string, locale: 'en' | 'es'): string {
  if (!duration) return duration;
  
  // Try exact match first
  if (ROUTINE_TRANSLATIONS[duration]) {
    return ROUTINE_TRANSLATIONS[duration][locale];
  }
  
  // Duration is usually language-agnostic (numbers + "min"), so return as-is
  return duration;
}

/**
 * Detects if a meditation title is in Spanish based on common patterns
 */
export function detectMeditationLanguage(title: string): 'en' | 'es' | 'unknown' {
  if (!title) return 'unknown';
  
  const titleLower = title.toLowerCase();
  
  // Spanish indicators - more specific patterns
  const spanishPatterns = [
    /respiraci[oó]n/i,
    /meditaci[oó]n/i,
    /relajaci[oó]n/i,
    /concentraci[oó]n/i,
    /atenci[oó]n/i,
    /consciencia/i,
    /conciencia/i,
    /presente/i,
    /momento/i,
    /calma/i,
    /paz/i,
    /serenidad/i,
    /tranquilidad/i,
    /viaje/i,
    /luz/i,
    /cuerpo/i,
    /corporal/i,
    /coherencia/i,
    /regulacion/i,
    /sistema/i,
    /nervioso/i,
    /presencia/i,
    /completa/i,
    /completo/i,
    // Spanish accented characters
    /[áéíóúñ]/
  ];
  
  // English indicators - more specific patterns
  const englishPatterns = [
    /meditation/i,
    /relaxation/i,
    /breathing/i,
    /breath/i,
    /concentration/i,
    /awareness/i,
    /present/i,
    /moment/i,
    /calm/i,
    /peace/i,
    /serenity/i,
    /tranquility/i,
    /focus/i,
    /guided/i,
    /journey/i,
    /light/i,
    /body/i,
    /coherence/i,
    /regulation/i,
    /system/i,
    /nervous/i,
    /presence/i,
    /complete/i,
    /space/i,
    /and/i
  ];
  
  const spanishMatches = spanishPatterns.filter(pattern => pattern.test(titleLower)).length;
  const englishMatches = englishPatterns.filter(pattern => pattern.test(titleLower)).length;
  
  // More strict matching: require clear indication
  if (spanishMatches > 0 && englishMatches === 0) return 'es';
  if (englishMatches > 0 && spanishMatches === 0) return 'en';
  if (spanishMatches > englishMatches) return 'es';
  if (englishMatches > spanishMatches) return 'en';
  
  return 'unknown';
}

/**
 * Filters meditations by language
 */
export function filterMeditationsByLanguage(meditations: MeditationData[], locale: 'en' | 'es'): MeditationData[] {
  return meditations.filter(meditation => {
    const detectedLang = detectMeditationLanguage(meditation.title);
    // Only include meditation if language clearly matches (no unknown)
    return detectedLang === locale;
  });
}

/**
 * Translates common content field patterns
 */
export function translateContentField(content: string, locale: 'en' | 'es'): string {
  if (!content) return content;
  
  let translatedContent = content;
  
  // First, try exact complete match for the entire content
  const trimmedContent = content.trim();
  if (ROUTINE_TRANSLATIONS[trimmedContent]) {
    return ROUTINE_TRANSLATIONS[trimmedContent][locale];
  }
  
  // Sort translations by length (longest first) to avoid partial replacements
  const sortedTranslations = Object.entries(ROUTINE_TRANSLATIONS).sort(
    ([a], [b]) => b.length - a.length
  );
  
  // Replace exact matches first (case-insensitive)
  sortedTranslations.forEach(([key, translations]) => {
    // Skip if we already found an exact match
    if (translatedContent !== content) return;
    
    // Create regex for whole word boundaries, escape special regex characters
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Try exact match for the whole content first
    const exactRegex = new RegExp(`^${escapedKey}$`, 'gi');
    if (exactRegex.test(translatedContent.trim())) {
      translatedContent = translations[locale];
      return;
    }
  });
  
  // If no exact match found, try partial replacements
  if (translatedContent === content) {
    sortedTranslations.forEach(([key, translations]) => {
      const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Try word boundary matches
      const wordBoundaryRegex = new RegExp(`\\b${escapedKey}\\b`, 'gi');
      translatedContent = translatedContent.replace(wordBoundaryRegex, translations[locale]);
      
      // Try line-based matching for numbered lists
      const lines = translatedContent.split('\n');
      translatedContent = lines.map(line => {
        const trimmedLine = line.trim();
        // Check if line starts with a number and period (like "1. Exercise Name")
        const numberMatch = trimmedLine.match(/^(\d+\.\s*)(.*)/);
        if (numberMatch) {
          const [, , exercise] = numberMatch;
          const cleanExercise = exercise.trim(); // Remove trailing spaces
          if (ROUTINE_TRANSLATIONS[cleanExercise]) {
            return line.replace(exercise, ROUTINE_TRANSLATIONS[cleanExercise][locale]);
          }
        }
        
        // Also try to replace the entire trimmed line if it matches a translation
        if (ROUTINE_TRANSLATIONS[trimmedLine]) {
          return line.replace(trimmedLine, ROUTINE_TRANSLATIONS[trimmedLine][locale]);
        }
        
        return line;
      }).join('\n');
    });
  }
  
  return translatedContent;
}

/**
 * Translates routine data object with all fields
 */
export function translateRoutineData(routineData: RoutineData, locale: 'en' | 'es'): RoutineData {
  if (!routineData) return routineData;
  
  // Log original data for debugging
  console.log(`🔍 Translating routine data to ${locale}:`, {
    originalTitle: routineData.title,
    originalDay: routineData.day,
    originalExercise: routineData.exercise?.substring(0, 100) + '...'
  });
  
  const translated = {
    ...routineData,
    day: translateDay(routineData.day, locale),
    title: translateRoutineTitle(routineData.title, locale),
    duration: translateDuration(routineData.duration, locale),
    content: translateContentField(routineData.content || '', locale),
    exercise: translateContentField(routineData.exercise || '', locale),
    pro_tip: translateProTip(routineData.pro_tip || '', locale),
    'areas-improve': translateContentField(routineData['areas-improve'] || '', locale),
    'rings-placement': translateContentField(routineData['rings-placement'] || '', locale)
  };
  
  // Log translated data for debugging
  console.log(`✅ Translated routine data:`, {
    translatedTitle: translated.title,
    translatedDay: translated.day,
    translatedExercise: translated.exercise?.substring(0, 100) + '...'
  });
  
  return translated;
}

/**
 * Translates pro tip content using complete translations to avoid mixing languages
 */
export function translateProTip(proTip: string, locale: 'en' | 'es'): string {
  if (!proTip) return proTip;
  
  // Clean up the pro tip text (remove extra whitespace, normalize line breaks)
  const cleanProTip = proTip.trim().replace(/\r\n/g, '\n').replace(/\n+/g, '\n');
  
  // Try exact match first with cleaned text
  if (PRO_TIP_TRANSLATIONS[cleanProTip]) {
    return PRO_TIP_TRANSLATIONS[cleanProTip][locale];
  }
  
  // Try to find a match ignoring minor formatting differences
  for (const [key, translation] of Object.entries(PRO_TIP_TRANSLATIONS)) {
    const cleanKey = key.trim().replace(/\r\n/g, '\n').replace(/\n+/g, '\n');
    if (cleanKey === cleanProTip) {
      return translation[locale];
    }
  }
  
  // If no exact match found, fall back to the general translation function
  // but only for individual words/phrases to minimize mixing
  return translateContentField(proTip, locale);
}
