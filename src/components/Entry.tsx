import { type Entry } from '../types';
import { useStateValue } from '../state';

const EntryComponent = ({ entry }: { entry: Entry }) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <div>
      {entry.date}: {entry.description}
      <ul>
        {entry.diagnosisCodes?.map((dc) => {
          return (
            <li key={dc}>
              {dc}: {diagnoses[dc]?.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default EntryComponent;
