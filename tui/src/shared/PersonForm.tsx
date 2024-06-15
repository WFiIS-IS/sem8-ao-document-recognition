import { Person } from "@/models/person"

type PersonFormProps = {
    personData?: Person
}

export function PersonForm(props: PersonFormProps){
    console.log(props);

    return (
        <div>
            Here should be form...
        </div>
    )
}
