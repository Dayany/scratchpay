const vetClinics = require("../data/vet-clinics.json");
const dentalClinics = require("../data/dental-clinics.json");
const clinics = [...vetClinics, ...dentalClinics];
const filters = require("../lib/filters");

describe("Test filters functions", () => {
  it("should return the clinic with the specified name", () => {
    const clinicFilteredByName = filters.getClinicsByClinicName(
      clinics,
      "Mount Sinai Hospital"
    );
    expect(clinicFilteredByName).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Mount Sinai Hospital",
        }),
      ])
    );
  });
  it("should return the clinic with the specified state name", () => {
    const clinicFilteredByState = filters.getClinicsByState(clinics, "CA");
    expect(clinicFilteredByState).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          stateCode: "CA",
        }),
      ])
    );
  });
  it("should return availability time sanitized", () => {
    const oneOrTwoDigitSanitized = filters.getAvailabilitySanitized("5");
    const fourDigitSanitized = filters.getAvailabilitySanitized("05:00");
    expect(oneOrTwoDigitSanitized).toBe("5:00");
    expect(fourDigitSanitized).toBe("05:00");
  });
  it("should convert written time to minutes", () => {
    const timeSanitized = filters.getAvailabilitySanitized("05:00");
    const timeInMinutes = filters.getTimeInMinutes(timeSanitized);
    expect(timeInMinutes).toBe(300);
  });
  it("should verify availability is within range", () => {
    const timeSanitized = filters.getAvailabilitySanitized("15:00");
    const result = filters.isTimeWithinClinicAvail(clinics[0], timeSanitized);
    expect(result).toBe(true);
  });
  it("should return clinics within the time available", () => {
    const timeSanitized = filters.getAvailabilitySanitized("24:00");
    const clinicsAvailAtTime = filters.getClinicsByAvailability(
      clinics,
      timeSanitized
    );
    expect(clinicsAvailAtTime).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          clinicName: "Scratchpay Test Pet Medical Center",
        }),
      ])
    );
  });
});
