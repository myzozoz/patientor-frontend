import { Entry } from '../types';
import { useStateValue } from '../state';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation'; // health check?
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'; // occupational
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'; // hospital
import { Card } from '@material-ui/core';

const EntryComponent = ({ entry }: { entry: Entry }) => {
  const [{ diagnoses }] = useStateValue();

  switch (entry.type) {
    case 'HealthCheck':
      return (
        <Card variant={'outlined'}>
          {entry.date}: <MedicalInformationIcon />
          <br />
          <i>{entry.description}</i>
          <br />
          Rating: {entry.healthCheckRating}
          <br />
          diagnosed by {entry.specialist}
        </Card>
      );
    case 'OccupationalHealthcare':
      return (
        <Card variant={'outlined'}>
          {entry.date}: <MedicalServicesIcon />
          <br />
          <i>{entry.description}</i>
          <ul>
            {entry.diagnosisCodes?.map((dc) => {
              return (
                <li key={dc}>
                  {dc}: {diagnoses[dc]?.name}
                </li>
              );
            })}
          </ul>
          Employer: {entry.employerName}
          {entry.sickLeave && (
            <p>
              Sick leave granted: {entry.sickLeave.startDate} -{' '}
              {entry.sickLeave.endDate}
            </p>
          )}
          diagnosed by {entry.specialist}
        </Card>
      );
    case 'Hospital':
      return (
        <Card variant={'outlined'}>
          {entry.date}: <LocalHospitalIcon />
          <br />
          <i>{entry.description}</i>
          <ul>
            {entry.diagnosisCodes?.map((dc) => {
              return (
                <li key={dc}>
                  {dc}: {diagnoses[dc]?.name}
                </li>
              );
            })}
          </ul>
          {entry.discharge && (
            <p>
              Discharged {entry.discharge.date}:{' '}
              <i>{entry.discharge.criteria}</i>
            </p>
          )}
          diagnosed by {entry.specialist}
        </Card>
      );
    default:
      return <div></div>;
  }
};

export default EntryComponent;
