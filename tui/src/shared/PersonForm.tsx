import { Person } from '@/models/person';

export type PersonFormProps = {
  personData?: Person;
};

export function PersonForm(props: PersonFormProps) {
  return (
    <div>
      <form className="flex flex-col">
        <p className="flex">
          PESEL: <p className="ml-2 font-bold">{props.personData?.pesel}</p>
        </p>
        <p className="flex">
          First name: <p className="ml-2 font-bold">{props.personData?.first_name}</p>
        </p>
        <p className="flex">
          Last name: <p className="ml-2 font-bold">{props.personData?.last_name}</p>
        </p>
      </form>
    </div>
  );
}
