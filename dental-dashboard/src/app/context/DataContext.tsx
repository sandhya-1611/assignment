import React, { createContext, useContext, useEffect, useState } from "react";
import { usersData } from "@/config/usersData";
import { hashPassword } from "../utils/hashPassword";
import { STORAGE_KEYS } from "@/config/constants";
import { patientsData } from "@/config/patientsData";
import { incidentData } from "@/config/incidentData";

type User = {
    id: string,
    name: string,
    hashedPassword: string,
    email: string,
    isAdmin: boolean
    patientId?: string
}

type Patient = {
    id: string;
    name: string;
    dob: string;
    contact: string;
    healthInfo: string;
}

type Incident = {
    id: string;
    patientId: string;
    title: string;
    description: string;
    comments: string;
    appointmentDate: string;
    cost: number;
    status: string;
    files: {name: string, url: string, type: string}[]
}

type DataContextType = {
    users: User[],
    patients: Patient[],
    incidents: Incident[],
    validateUser: (email: string, password: string) => User | undefined,
    addPatient: (patient: Patient) => void,
    updatePatient: (patientId: string,updatePatient: Patient) => void,
    deletePatient: (patientId: string) => void,
    addIncident: (incident: Incident) => void,
    updateIncident: (incidentId: string,updateIncident: Incident) => void,
    deleteIncident: (incidentId: string) => void,
    getIncidentsByPatientId: (patientId: string) => Incident[],
    getPatientById: (patientId: string) => Patient | null,
    reloadData: () => void,
    isLoading: boolean

}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({children}: {children: React.ReactNode}){
    const [users, setUsers] = useState<User[]>([])
    const [patients, setPatients] = useState<Patient[]>([])
    const [incidents, setIncidents] = useState<Incident[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED)

        if(!isInitialized){
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(usersData))
            localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patientsData))
            localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidentData))
            localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true")
        }

    setUsers(JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'));
    setPatients(JSON.parse(localStorage.getItem(STORAGE_KEYS.PATIENTS) || '[]'));
    setIncidents(JSON.parse(localStorage.getItem(STORAGE_KEYS.INCIDENTS) || '[]'));
    setIsLoading(false)
    },[])

    const reloadData = () => {
        localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
        localStorage.removeItem(STORAGE_KEYS.USERS);
        localStorage.removeItem(STORAGE_KEYS.PATIENTS);
        localStorage.removeItem(STORAGE_KEYS.INCIDENTS);

        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(usersData));
        localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patientsData));
        localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidentData));
        localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true");

        setUsers(JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'));
        setPatients(JSON.parse(localStorage.getItem(STORAGE_KEYS.PATIENTS) || '[]'));
        setIncidents(JSON.parse(localStorage.getItem(STORAGE_KEYS.INCIDENTS) || '[]'));
    };

    const validateUser = (email:string,password:string): User | undefined => {
        const hashedPassword = hashPassword(password)

        return usersData.find(user => user.email === email && user.hashedPassword === hashedPassword)
    }

    const addPatient = (patient: Patient) => {
        const newPatient = {
            ...patient,
            id: `p${patients.length + 1}`
        }
        const newPatientsList = [...patients,newPatient]
        setPatients(newPatientsList)
        localStorage.setItem(STORAGE_KEYS.PATIENTS,JSON.stringify(newPatientsList))
    }

    const updatePatient = (patientId: string,updatePatient: Patient) => {
        const newPatientsList = patients.map((patient) => patient.id === patientId ? updatePatient : patient)
        setPatients(newPatientsList)
        localStorage.setItem(STORAGE_KEYS.PATIENTS,JSON.stringify(newPatientsList))
    }

    const deletePatient = (patientId: string) => {
        const newPatientsList = patients.filter((patient) => patient.id !== patientId)
        setPatients(newPatientsList)
        localStorage.setItem(STORAGE_KEYS.PATIENTS,JSON.stringify(newPatientsList))
    }

    const addIncident = (incident: Incident) => {
        const newIncident = {
            ...incident,
            id: `i${incidents.length + 1}`
        }
        const newIncidentsList = [...incidents,newIncident]
        setIncidents(newIncidentsList)
        localStorage.setItem(STORAGE_KEYS.INCIDENTS,JSON.stringify(newIncidentsList))
    }

    const updateIncident = (incidentId: string,updateIncident: Incident) => {
        const newIncidentsList = incidents.map((incident) => incident.id === incidentId ? updateIncident : incident)
        setIncidents(newIncidentsList)
        localStorage.setItem(STORAGE_KEYS.INCIDENTS,JSON.stringify(newIncidentsList))
    }

    const deleteIncident = (incidentId: string) => {
        const newIncidentsList = incidents.filter((incident) => incident.id !== incidentId)
        setIncidents(newIncidentsList)
        localStorage.setItem(STORAGE_KEYS.INCIDENTS,JSON.stringify(newIncidentsList))
    }
    
    const getIncidentsByPatientId = (patientId: string): Incident[] => {
        return incidents.filter(incident => incident.patientId === patientId)
    }

    const updateProfile = (updateProfile: any) => {
  setPatients((prev) =>
    prev.map((p) => (p.id === updateProfile.id ? updateProfile : p))
  );

  const updatedList = patients.map((p) =>
    p.id === updateProfile.id ? updateProfile : p
  );
  localStorage.setItem('patients', JSON.stringify(updatedList));
};


    const getPatientById = (patientId: string): Patient | null => {
        return patients.find(patient => patient.id === patientId) || null
    }

    const value = {
        users,
        patients,
        incidents,
        validateUser,
        addPatient,
        updatePatient,
        deletePatient,
        updateProfile,
        addIncident,
        updateIncident,
        deleteIncident,
        getIncidentsByPatientId,
        getPatientById,
        reloadData,
        isLoading
    }

    return <DataContext.Provider value={value} >
        {children}
    </DataContext.Provider>

}

export function useData(){
    const context = useContext(DataContext)
    if(!context){
        throw new Error("useData must be used within a DataProvider")
    }
    return context
}