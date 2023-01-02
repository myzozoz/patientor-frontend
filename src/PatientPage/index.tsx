import React, { useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Patient, Entry } from '../types';
import { apiBaseUrl } from '../constants';
import { useStateValue, updatePatient, addEntry } from '../state';
import EntryComponent from '../components/Entry';
import { Button } from '@material-ui/core';
import AddEntryModal from '../AddEntryModal';
import { EntryFormValues } from '../AddEntryModal/AddEntryForm';

const PatientPage = () => {
  const [{ patients }, dispatch] = useStateValue();
  const [patient, setPatient] = React.useState<Patient>();
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>();
  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const { id } = useParams<{ id: string }>();

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      if (!id) {
        throw new Error('No ID could be parsed from URL parameters');
      }
      const { data: newEntry } = await axios.post<Entry>(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `${apiBaseUrl}/patients/${id}/entries`,
        values,
      );
      dispatch(addEntry(newEntry, id));
      closeModal();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || 'Unrecognized axios error');
        setError(
          String(e?.response?.data?.error) || 'Unrecognized axios error',
        );
      } else {
        console.error('Unknown error', e);
        setError('Unknown error');
      }
    }
  };

  useEffect(() => {
    const fetchPatient = async () => {
      const { data: updatedPatient } = await axios.get<Patient>(
        `${apiBaseUrl}/patients/${String(id)}`,
      );
      dispatch(updatePatient(updatedPatient));
      setPatient(updatedPatient);
    };
    try {
      const current_patient = id && patients[id];
      if (!current_patient || !current_patient.entries) {
        void fetchPatient();
      } else {
        setPatient(current_patient);
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || 'Unrecognized axios error');
      } else {
        console.error('Unknown error', e);
      }
    }
  }, [patients]);

  return (
    <div className='App'>
      <p>
        <b>
          {patient?.name} {`(${String(patient?.gender)})`}
        </b>
      </p>
      ssn: {patient?.ssn}
      <br />
      born: {patient?.dateOfBirth}
      <br />
      occupation: {patient?.occupation}
      <br />
      <p>
        <b>entries:</b>
      </p>
      {patient?.entries?.map((e) => (
        <EntryComponent key={e.id} entry={e} />
      ))}
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button variant='contained' onClick={() => openModal()}>
        Add New Entry
      </Button>
    </div>
  );
};

export default PatientPage;
