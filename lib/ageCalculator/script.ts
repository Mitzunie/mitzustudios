"use client";

import { useState, useEffect } from 'react';

const useAge = (birthYear: number, birthMonth: number, birthDay: number) => {
  const [age, setAge] = useState(0);

  useEffect(() => {
    const calculateAge = () => {
      const today = new Date();
      const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
      let newAge = today.getFullYear() - birthDate.getFullYear();

      if (
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
      ) {
        newAge--;
      }

      setAge(newAge);
    };

    calculateAge();

    const nextBirthday = new Date(new Date().getFullYear(), birthMonth - 1, birthDay);
    const timeUntilNextBirthday = nextBirthday.getTime() - new Date().getTime();
    const timer = setTimeout(calculateAge, timeUntilNextBirthday);

    return () => clearTimeout(timer);
  }, [birthYear, birthMonth, birthDay]);

  return age;
};

export default useAge;
