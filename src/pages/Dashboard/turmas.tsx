"use client";

import { useState, useEffect } from "react";
import ClassesView from "../../components/classView";
import ClassDetail from "../../components/classDetail";
import type { Class } from "../../types/index";

export function Turmas() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedClasses = localStorage.getItem("classes");
    if (savedClasses) {
      setClasses(JSON.parse(savedClasses));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("classes", JSON.stringify(classes));
    }
  }, [classes, isLoading]);

  const handleCreateClass = (classData: Omit<Class, "id" | "students">) => {
    const newClass: Class = {
      ...classData,
      id: Date.now().toString(),
      students: [],
    };
    setClasses([...classes, newClass]);
  };

  const handleUpdateClass = (updatedClass: Class) => {
    setClasses(
      classes.map((c) => (c.id === updatedClass.id ? updatedClass : c))
    );
    setSelectedClass(updatedClass);
  };

  const handleDeleteClass = (classId: string) => {
    setClasses(classes.filter((c) => c.id !== classId));
    setSelectedClass(null);
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return selectedClass ? (
    <ClassDetail
      classItem={selectedClass}
      onUpdate={handleUpdateClass}
      onDelete={handleDeleteClass}
      onBack={() => setSelectedClass(null)}
    />
  ) : (
    <ClassesView
      classes={classes}
      onSelectClass={setSelectedClass}
      onCreateClass={handleCreateClass}
    />
  );
}
