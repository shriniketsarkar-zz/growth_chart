window.GC = window.GC || {};

GC.get_data = function() {
  var dfd = $.Deferred();

  FHIR.oauth2.ready(onReady, onError);

  function onError(){
    console.log("Loading error", arguments);
    dfd.reject({
      responseText: "Loading error. See console for details."
    });
  };

  function onErrorWithWarning(msg){
    console.log("Loading error", arguments);
    dfd.reject({
      responseText: msg,
      showMessage: true,
      messageType: 'warning',
    })
  };

  function onReady(smart){

    var hidePatientHeader = (smart.tokenResponse.need_patient_banner === false);
    GC.Preferences.prop("hidePatientHeader", hidePatientHeader);

    function defaultOnFail(promise, defaultValue) {
      var deferred = $.Deferred();
      $.when(promise).then(
          function (data) {
            deferred.resolve(data);
          },
          function () {
            deferred.resolve(defaultValue);
          }
      );
      return deferred.promise();
    };

    if (smart.hasOwnProperty('patient')) {
      var ptFetch = smart.patient.read();
      //var vitalsFetch = smart.patient.api.fetchAll({type: "Observation", query: {code: {$or: ['http://loinc.org|3141-9',
      //  'http://loinc.org|8302-2', 'http://loinc.org|8287-5',
      //  'http://loinc.org|39156-5', 'http://loinc.org|18185-9',
      //  'http://loinc.org|37362-1', 'http://loinc.org|11884-4']}}});

      $.when(ptFetch).fail(function() {
        onErrorWithWarning(GC.str('STR_Error_LoadingApplication'));
      });

      var familyHistoryFetch = defaultOnFail(smart.patient.api.fetchAll({type: "FamilyMemberHistory"}), []);

      $.when(ptFetch, familyHistoryFetch).done(onData);
    } else {
      onErrorWithWarning(GC.str('STR_Error_LoadingApplication'));
    }

    function onData(patient, familyHistories){
      // check patient gender
      if (!isKnownGender(patient.gender)) onErrorWithWarning(GC.str('STR_Error_UnknownGender'));

      //var vitalsByCode = smart.byCode(vitals, 'code');

      var t0 = new Date().getTime();

      // Initialize an empty patient structure
      var p = {
        demographics: { },
        vitals:{
          lengthData: [],
          weightData: [],
          BMIData: [],
          headCData: []
        },
        boneAge: [],
        familyHistory: {
          father : {
            height: null,
            isBio : false
          },
          mother : {
            height: null,
            isBio : false
          }
        }
      };

      // For debugging/exploration, a global handle on the output
      //console.log("Check out the parsed FHIR data: window.patient, window.vitalsByCode, window.familyHistories");
      window.patient = patient;
      //window.vitalsByCode = vitalsByCode;
      window.familyHistories = familyHistories;

      var fname = patient.name[0].given.join(" ");
      var lname = patient.name[0].family.join(" ");
      p.demographics.name = fname + " " + lname;
      p.demographics.birthday = patient.birthDate;
      p.demographics.gender = patient.gender;

      //var gestAge = vitalsByCode['18185-9'];
      //if (gestAge === undefined) {
      //  //handle an alternate mapping of Gest Age used by Cerner
      //  gestAge = vitalsByCode['11884-4'];
      //}
      //if (gestAge && gestAge.length > 0) {
      //  var weeks = 0, qty = gestAge[0].valueString ?
      //    gestAge[0].valueString.value || '40W 0D' :
      //    gestAge[0].valueQuantity ?
      //      gestAge[0].valueQuantity.value || 40 :
      //      40;
      //
      //  if (typeof qty == 'string') {yu
      //    if (qty.indexOf("weeks") > 0 ) {
      //      qty = qty.replace(/ weeks/gi, "W");
      //    }
      //    qty.replace(/(\d+)([WD])\s*/gi, function(token, num, code) {
      //      num = parseFloat(num);
      //      if (code.toUpperCase() == 'D') {
      //        num /= 7;
      //      }
      //      weeks += num;
      //    });
      //  } else {
      //    weeks = qty;
      //  }
      //
      //  p.demographics.gestationalAge = weeks;
      //  p.demographics.weeker = weeks;
      //}

      //var units = smart.units;
      //process(vitalsByCode['3141-9'], units.kg, p.vitals.weightData);
      //process(vitalsByCode['8302-2'],  units.cm,  p.vitals.lengthData);
      //process(vitalsByCode['8287-5'],  units.cm,  p.vitals.headCData);
      //process(vitalsByCode['39156-5'], units.any, p.vitals.BMIData);
      //processBA(vitalsByCode['37362-1'], p.boneAge);

      function isKnownGender(gender) {
        switch (gender) {
          case 'male':
          case 'female':
            return true;
            break;
        }
        return false;
      }

      function process(observationValues, toUnit, arr){
        observationValues && observationValues.forEach(function(v){
          if (v.status.toLowerCase() === 'final' || v.status.toLowerCase() === 'amended') {
            arr.push({
              agemos: months(v.effectiveDateTime, patient.birthDate),
              value: toUnit(v.valueQuantity),
              display: v.effectiveDateTime
            });
          }
        });
      };

      function processBA(boneAgeValues, arr){
        boneAgeValues && boneAgeValues.forEach(function(v){
          if (v.status.toLowerCase() === 'final' || v.status.toLowerCase() === 'amended') {
            arr.push({
              date: v.effectiveDateTime,
              boneAgeMos: units.any(v.valueQuantity)
            });
          }
        });
      };

      function months(d){
        return -1 * new XDate(d).diffMonths(new XDate(p.demographics.birthday));
      }

      $.each(familyHistories, function(index, fh){
        if (fh.resourceType === "FamilyMemberHistory") {
              var code = fh.relationship.coding[0].code;
              $.each(fh.extension || [], function(index, ext){
                if (ext.url === "http://fhir-registry.smarthealthit.org/StructureDefinition/family-history#height") {
                  var ht = units.cm(ext.valueQuantity);
                  var r = null;
                  if (code === 'FTH') {
                    r = p.familyHistory.father;
                  } else if (code === 'MTH') {
                    r = p.familyHistory.mother;
                  }
                  if (r) {
                    r.height = ht;
                    r.isBio = true;
                  }
                }
              });
        }
      });

      pMock = {};
      pMock.boneAge = [];
      pMock.demographics = {name: "GROWTHCHART10 SMARTAPP", birthday: "2014-11-05", gender: "male"};
      pMock.vitals = {};
      pMock.vitals.lengthData = [];
      pMock.vitals.weightData = [];
      pMock.vitals.BMIData = [];
      pMock.vitals.headCData = [];
      pMock.vitals.headCData[0] = {
        agemos: 20.728270609318997,
        display: "2016-07-27T18:50:00.000Z",
        value: 45
      };
      pMock.vitals.headCData[1] = {
        agemos: 17.47208781362007,
        display: "2016-04-19T20:14:00.000Z",
        value: 32
      };
      pMock.vitals.headCData[2] = {
        agemos: 12.018906810035842,
        display: "2015-11-05T20:04:00.000Z",
        value: 46.6
      };
      pMock.vitals.headCData[3] = {
        agemos: 6.01888440860215,
        display: "2015-05-05T19:03:00.000Z",
        value: 43.6
      };
      pMock.vitals.headCData[4] = {
        agemos: 7.01888440860215,
        display: "2015-02-05T20:02:00.000Z",
        value: 40.6
      };
      pMock.vitals.headCData[5] = {
        agemos: 1.0188172043010753,
        display: "2014-12-05T20:00:00.000Z",
        value: 37.6
      };

      p.vitals.headCData = pMock.vitals.headCData;
      window.data = p;
      console.log("Check out the patient's growth data: window.data");
      dfd.resolve(p);
    }
  }

  return dfd.promise();
};
