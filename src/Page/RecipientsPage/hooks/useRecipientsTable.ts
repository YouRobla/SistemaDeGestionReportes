"use client";

import * as React from "react";
import { useState, useCallback } from "react";
import { useProfesores } from "@/hooks/useProfesores";
import type { Person } from "../types";

export function useRecipientsTable() {
  // 🚀 Estados para los diálogos
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<Person | undefined>();
  
  // 🚀 Estados para operaciones
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 🚀 Hook para manejar profesores
  const {
    profesores: data,
    loading,
    error,
    fetchProfesores,
    createProfesor,
    updateProfesor,
    deleteProfesor,
  } = useProfesores();

  // 🚀 Cargar profesores al montar el componente
  React.useEffect(() => {
    fetchProfesores();
  }, [fetchProfesores]);

  // 🚀 Funciones para manejar las acciones
  const handleAddRecipient = useCallback(async (recipientData: Omit<Person, 'id'>) => {
    setIsAdding(true);
    try {
      await createProfesor(recipientData);
      // 🚀 Refrescar la tabla después de agregar
      await fetchProfesores();
      // 🚀 Cerrar el diálogo
      setAddDialogOpen(false);
    } catch (error) {
      console.error("Error al agregar profesor:", error);
    } finally {
      setIsAdding(false);
    }
  }, [createProfesor, fetchProfesores]);

  const handleEditRecipient = useCallback(async (recipientData: Omit<Person, 'id'>) => {
    if (selectedRecipient?.id) {
      setIsEditing(true);
      try {
        await updateProfesor(selectedRecipient.id, recipientData);
        // 🚀 Refrescar la tabla después de editar
        await fetchProfesores();
        // 🚀 Cerrar el diálogo
        setEditDialogOpen(false);
      } catch (error) {
        console.error("Error al editar profesor:", error);
      } finally {
        setIsEditing(false);
      }
    }
  }, [selectedRecipient?.id, updateProfesor, fetchProfesores]);

  const handleDeleteRecipient = useCallback(async () => {
    if (selectedRecipient?.id) {
      setIsDeleting(true);
      try {
        await deleteProfesor(selectedRecipient.id);
        // 🚀 Refrescar la tabla después de eliminar
        await fetchProfesores();
        // 🚀 Cerrar el diálogo
        setDeleteDialogOpen(false);
      } catch (error) {
        console.error("Error al eliminar profesor:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  }, [selectedRecipient?.id, deleteProfesor, fetchProfesores]);

  const handleEditClick = useCallback((recipient: Person) => {
    setSelectedRecipient(recipient);
    setEditDialogOpen(true);
  }, []);

  const handleDeleteClick = useCallback((recipient: Person) => {
    setSelectedRecipient(recipient);
    setDeleteDialogOpen(true);
  }, []);

  return {
    // Estados
    data,
    loading,
    error,
    addDialogOpen,
    editDialogOpen,
    deleteDialogOpen,
    selectedRecipient,
    isAdding,
    isEditing,
    isDeleting,
    
    // Funciones
    fetchProfesores,
    handleAddRecipient,
    handleEditRecipient,
    handleDeleteRecipient,
    handleEditClick,
    handleDeleteClick,
    
    // Setters
    setAddDialogOpen,
    setEditDialogOpen,
    setDeleteDialogOpen,
  };
}
