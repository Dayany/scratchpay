const getCompletelyFilteredClinics = (clinics, filters) => {
  const { clinicName, state, availability } = filters;
  const availabilityFilter = getAvailabilitySanitized(availability);
  let result = clinics;

  result = clinicName ? getClinicsByClinicName(result, clinicName) : result;
  result = state ? getClinicsByState(result, state) : result;
  result = availabilityFilter
    ? getClinicsByAvailability(result, availabilityFilter)
    : result;
  return result;
};

const getClinicsByClinicName = (clinics, clinicFilter) => {
  return clinics.filter((clinic) => {
    if (
      clinic.clinicName?.includes(clinicFilter) ||
      clinic.name?.includes(clinicFilter)
    )
      return clinic;
  });
};

const getClinicsByState = (clinics, stateFilter) => {
  return clinics.filter((clinic) => {
    if (
      clinic.stateCode?.includes(stateFilter) ||
      clinic.stateName?.includes(stateFilter)
    ) {
      return clinic;
    }
    return false;
  });
};

const getClinicsByAvailability = (clinics, availabilityFilter) => {
  return clinics.filter((clinic) => {
    if (isTimeWithinClinicAvail(clinic, availabilityFilter)) {
      return clinic;
    }
    return false;
  });
};

const isTimeWithinClinicAvail = (clinic, availabilityFilter) => {
  if (!clinic.availability?.from && !clinic.opening?.from) return clinic;
  if (!clinic.availability?.to && !clinic.opening?.to) return clinic;

  //Assume data either has availability or opening field
  const fromTime = clinic.availability
    ? clinic.availability.from
    : clinic.opening.from;
  const toTime = clinic.availability
    ? clinic.availability.to
    : clinic.opening.to;

  const fromTimeInMinutes = getTimeInMinutes(fromTime);
  const toTimeInMinutes = getTimeInMinutes(toTime);
  const availabilityFilterInMinutes = getTimeInMinutes(availabilityFilter);

  return (
    fromTimeInMinutes <= availabilityFilterInMinutes &&
    availabilityFilterInMinutes <= toTimeInMinutes
  );
};

//Assume data was sanitized to handle string of 2 numbers : 2 numbers
const getTimeInMinutes = (time) => {
  let timeSplit = time.split(":");
  return Number(timeSplit[0]) * 60 + Number(timeSplit[1]);
};

//Could be improved depending on requirements
//Using regex to better the sanitizing
const getAvailabilitySanitized = (filter) => {
  getClinicsByAvailability;
  if (!filter) return false;

  return filter.length <= 2 ? `${filter}:00` : `${filter}`;
};

module.exports = {
  getAvailabilitySanitized,
  getTimeInMinutes,
  isTimeWithinClinicAvail,
  getClinicsByState,
  getClinicsByAvailability,
  getCompletelyFilteredClinics,
  getClinicsByClinicName,
};
