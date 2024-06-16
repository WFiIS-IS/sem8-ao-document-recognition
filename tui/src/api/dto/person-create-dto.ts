export type PersonCreateDto = {
  first_name: string;
  last_name: string;
  pesel: string;
  date_of_birth: string | null;
  id_number: string | null;
  driving_license_number: string | null;
  face_vector: string;
};
