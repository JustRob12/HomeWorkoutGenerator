import {
  GiMuscularTorso,
  GiWeight,
  GiMuscleFat,
  GiLeg,
  GiRun,
  GiJumpingRope,
  GiMuscleUp,
  GiBiceps,
  GiChestArmor,
} from 'react-icons/gi';
import {
  FaDumbbell,
  FaRunning,
  FaWalking,
  FaChair,
  FaFire,
} from 'react-icons/fa';
import { CgGym } from 'react-icons/cg';
import { BiBody } from 'react-icons/bi';
import { IoMdFitness } from 'react-icons/io';

const exerciseIcons = {
  // Beginner Exercises
  'Wall Push-ups': GiMuscularTorso,
  'Standing Bicep Curls with Resistance Band': GiBiceps,
  'Tricep Dips on Chair': FaChair,
  'Bodyweight Squats': GiLeg,
  'Standing Calf Raises': GiLeg,
  'Assisted Lunges': GiLeg,
  'Superman Hold': BiBody,
  'Band Pull-Aparts': GiMuscleUp,
  'Bird Dogs': BiBody,
  'Standing Chest Press with Band': GiChestArmor,
  'Modified Plank': BiBody,
  'Knee Raises': BiBody,
  'Modified Crunches': BiBody,
  'Wall Angels': GiMuscleUp,
  'Arm Circles': GiBiceps,
  'Band Front Raises': GiMuscleUp,
  'Walking in Place': FaWalking,
  'Modified Jumping Jacks': FaRunning,
  'Step-Ups': GiLeg,

  // Intermediate Exercises
  'Regular Push-ups': GiMuscularTorso,
  'Diamond Push-ups': GiMuscularTorso,
  'Tricep Dips': CgGym,
  'Jump Squats': GiLeg,
  'Walking Lunges': GiLeg,
  'Single-Leg Calf Raises': GiLeg,
  'Superman with Arm/Leg Raise': BiBody,
  'Resistance Band Rows': GiMuscleUp,
  'Reverse Snow Angels': GiMuscleUp,
  'Wide Push-ups': GiMuscularTorso,
  'Decline Push-ups': GiMuscularTorso,
  'Plank': BiBody,
  'Mountain Climbers': GiRun,
  'Russian Twists': BiBody,
  'Pike Push-ups': GiMuscularTorso,
  'Band Shoulder Press': GiMuscleUp,
  'Lateral Raises with Band': GiMuscleUp,
  'High Knees': GiRun,
  'Burpees': IoMdFitness,
  'Jump Rope': GiJumpingRope,

  // Advanced Exercises
  'Clap Push-ups': GiMuscularTorso,
  'Pike Push-ups to Handstand': GiMuscularTorso,
  'Pseudo Planche Push-ups': GiMuscularTorso,
  'Pistol Squats': GiLeg,
  'Plyometric Lunges': GiLeg,
  'Box Jumps': GiLeg,
  'Inverted Rows': GiMuscleUp,
  'Renegade Rows': GiMuscleUp,
  'Back Extensions with Hold': BiBody,
  'Plyometric Push-ups': GiMuscularTorso,
  'Archer Push-ups': GiMuscularTorso,
  'Diamond to Wide Push-ups': GiMuscularTorso,
  'Dragon Flags': BiBody,
  'L-Sits': BiBody,
  'Windshield Wipers': BiBody,
  'Handstand Push-ups': GiMuscularTorso,
  'Pike Press to Handstand': GiMuscularTorso,
  'Wall Walks': GiMuscularTorso,
  'Burpee Pull-ups': IoMdFitness,
  'Double Unders': GiJumpingRope,
  'Sprinter Burpees': FaFire,
};

export const getExerciseIcon = (exerciseName) => {
  const IconComponent = exerciseIcons[exerciseName] || FaDumbbell;
  return IconComponent;
};

export default exerciseIcons;
