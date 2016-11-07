window.GC = window.GC || {};

GC.get_data = function() {
  var dfd = $.Deferred();

  //FHIR.oauth2.ready(onReady, onError);

  //function onError(){
  //  console.log("Loading error", arguments);
  //  dfd.reject({
  //    responseText: "Loading error. See console for details."
  //  });
  //};

  //function onErrorWithWarning(msg){
  //  console.log("Loading error", arguments);
  //  dfd.reject({
  //    responseText: msg,
  //    showMessage: true,
  //    messageType: 'warning',
  //  })
  //};

  //function onReady(smart){

    var hidePatientHeader = false;//(smart.tokenResponse.need_patient_banner === false);
    GC.Preferences.prop("hidePatientHeader", hidePatientHeader);

    //function defaultOnFail(promise, defaultValue) {
    //  var deferred = $.Deferred();
    //  $.when(promise).then(
    //      function (data) {
    //        deferred.resolve(data);
    //      },
    //      function () {
    //        deferred.resolve(defaultValue);
    //      }
    //  );
    //  return deferred.promise();
    //};

    //if (smart.hasOwnProperty('patient')) {
      //var ptFetch = smart.patient.read();
      //var vitalsFetch = smart.patient.api.fetchAll({type: "Observation", query: {code: {$or: ['http://loinc.org|3141-9',
      //  'http://loinc.org|8302-2', 'http://loinc.org|8287-5',
      //  'http://loinc.org|39156-5', 'http://loinc.org|18185-9',
      //  'http://loinc.org|37362-1', 'http://loinc.org|11884-4']}}});

      //$.when(ptFetch).fail(function() {
      //  onErrorWithWarning(GC.str('STR_Error_LoadingApplication'));
      //});

      //var familyHistoryFetch = defaultOnFail(smart.patient.api.fetchAll({type: "FamilyMemberHistory"}), []);

      //$.when(familyHistoryFetch).done(onData);
    //} else {
    //  onErrorWithWarning(GC.str('STR_Error_LoadingApplication'));
    //}

    //function onData(familyHistories){
      // check patient gender
      //if (!isKnownGender(patient.gender)) onErrorWithWarning(GC.str('STR_Error_UnknownGender'));

      //var vitalsByCode = smart.byCode(vitals, 'code');

      //var t0 = new Date().getTime();

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
      //window.patient = patient;
      //window.vitalsByCode = vitalsByCode;
      //window.familyHistories = familyHistories;

      //var fname = patient.name[0].given.join(" ");
      //var lname = patient.name[0].family.join(" ");
      //p.demographics.name = fname + " " + lname;
      //p.demographics.birthday = patient.birthDate;
      //p.demographics.gender = patient.gender;

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

      //function process(observationValues, toUnit, arr){
      //  observationValues && observationValues.forEach(function(v){
      //    if (v.status.toLowerCase() === 'final' || v.status.toLowerCase() === 'amended') {
      //      arr.push({
      //        agemos: months(v.effectiveDateTime, patient.birthDate),
      //        value: toUnit(v.valueQuantity),
      //        display: v.effectiveDateTime
      //      });
      //    }
      //  });
      //};
      //
      //function processBA(boneAgeValues, arr){
      //  boneAgeValues && boneAgeValues.forEach(function(v){
      //    if (v.status.toLowerCase() === 'final' || v.status.toLowerCase() === 'amended') {
      //      arr.push({
      //        date: v.effectiveDateTime,
      //        boneAgeMos: units.any(v.valueQuantity)
      //      });
      //    }
      //  });
      //};

      //function months(d){
      //  return -1 * new XDate(d).diffMonths(new XDate(p.demographics.birthday));
      //}

      //$.each(familyHistories, function(index, fh){
      //  if (fh.resourceType === "FamilyMemberHistory") {
      //        var code = fh.relationship.coding[0].code;
      //        $.each(fh.extension || [], function(index, ext){
      //          if (ext.url === "http://fhir-registry.smarthealthit.org/StructureDefinition/family-history#height") {
      //            var ht = units.cm(ext.valueQuantity);
      //            var r = null;
      //            if (code === 'FTH') {
      //              r = p.familyHistory.father;
      //            } else if (code === 'MTH') {
      //              r = p.familyHistory.mother;
      //            }
      //            if (r) {
      //              r.height = ht;
      //              r.isBio = true;
      //            }
      //          }
      //        });
      //  }
      //});

      pMock = {};
      pMock.boneAge = [];
      pMock.demographics = {name: "Cassie Garcia", birthday: "2006-11-21", gender: "female"};
      pMock.vitals = {};
      pMock.vitals.lengthData = [];
      pMock.vitals.weightData = [];
      pMock.vitals.BMIData = [];
      pMock.vitals.headCData = [];

      pMock.vitals.BMIData[0] = {
        agemos: 111.10931899641577,
        display: "2016-02-24T15:20:00.000Z",
        value: 20.72
      };
      pMock.vitals.BMIData[1] = {
        agemos: 108.43187724014336,
        display: "2015-12-03T15:19:00.000Z",
        value: 20.92
      };
      pMock.vitals.BMIData[2] = {
        agemos: 108.43183243727599,
        display: "2015-12-03T15:17:00.000Z",
        value: 20.92
      };
      pMock.vitals.BMIData[3] = {
        agemos: 104.81883960573477,
        display: "2015-08-15T14:13:00.000Z",
        value: 20.79
      };
      pMock.vitals.BMIData[4] = {
        agemos: 101.91556899641577,
        display: "2015-05-18T14:11:00.000Z",
        value: 20.69
      };
      pMock.vitals.BMIData[5] = {
        agemos: 99.20582437275985,
        display: "2015-02-27T15:08:00.000Z",
        value: 20.63
      };
      pMock.vitals.BMIData[6] = {
        agemos: 61.94758064516129,
        display: "2012-01-19T15:00:00.000Z",
        value: 15.83
      };
      pMock.vitals.BMIData[7] = {
        agemos: 49.97983870967742,
        display: "2011-01-20T15:00:00.000Z",
        value: 15.68
      };
      pMock.vitals.BMIData[8] = {
        agemos: 37.23790322580645,
        display: "2009-12-28T15:00:00.000Z",
        value: 16.08
      };
      pMock.vitals.BMIData[9] = {
        agemos: 24.9644041218638,
        display: "2008-12-20T03:31:00.000Z",
        value: 16.96
      };
      pMock.vitals.BMIData[10] = {
        agemos: 11.97983870967742,
        display: "2007-11-20T15:00:00.000Z",
        value: 17.59
      };


      pMock.vitals.lengthData[0] = {
        agemos: 111.10931899641577,
        display: "2016-02-24T15:20:00.000Z",
        value: 137.2
      };
      pMock.vitals.lengthData[1] = {
        agemos: 108.43187724014336,
        display: "2015-12-03T15:19:00.000Z",
        value: 136
      };
      pMock.vitals.lengthData[2] = {
        agemos: 108.43183243727599,
        display: "2015-12-03T15:17:00.000Z",
        value: 136
      };
      pMock.vitals.lengthData[3] = {
        agemos: 104.81883960573477,
        display: "2015-08-15T14:13:00.000Z",
        value: 135.2
      };
      pMock.vitals.lengthData[4] = {
        agemos: 101.91556899641577,
        display: "2015-05-18T14:11:00.000Z",
        value: 134.1
      };
      pMock.vitals.lengthData[5] = {
        agemos: 100.43145161290323,
        display: "2015-04-03T14:00:00.000Z",
        value: 133
      };
      pMock.vitals.lengthData[6] = {
        agemos: 99.20582437275985,
        display: "2015-02-27T15:08:00.000Z",
        value: 133
      };
      pMock.vitals.lengthData[7] = {
        agemos: 97.49731182795699,
        display: "2015-01-05T16:00:00.000Z",
        value: 131.5
      };
      pMock.vitals.lengthData[8] = {
        agemos: 94.56720430107526,
        display: "2014-10-07T19:00:00.000Z",
        value: 130
      };
      pMock.vitals.lengthData[9] = {
        agemos: 91.36693548387098,
        display: "2014-07-01T14:00:00.000Z",
        value: 127.5
      };
      pMock.vitals.lengthData[10] = {
        agemos: 88.46639784946237,
        display: "2014-04-04T16:00:00.000Z",
        value: 126
      };
      pMock.vitals.lengthData[11] = {
        agemos: 85.52956989247312,
        display: "2014-01-06T16:00:00.000Z",
        value: 125
      };
      pMock.vitals.lengthData[12] = {
        agemos: 82.43817204301075,
        display: "2013-10-03T19:00:00.000Z",
        value: 124
      };
      pMock.vitals.lengthData[13] = {
        agemos: 79.59408602150538,
        display: "2013-07-08T15:00:00.000Z",
        value: 121.5
      };
      pMock.vitals.lengthData[14] = {
        agemos: 76.47043010752688,
        display: "2013-04-04T19:00:00.000Z",
        value: 119.5
      };
      pMock.vitals.lengthData[15] = {
        agemos: 61.94758064516129,
        display: "2012-01-19T15:00:00.000Z",
        value: 111
      };
      pMock.vitals.lengthData[16] = {
        agemos: 49.97983870967742,
        display: "2011-01-20T15:00:00.000Z",
        value: 101
      };
      pMock.vitals.lengthData[17] = {
        agemos: 37.23790322580645,
        display: "2009-12-28T15:00:00.000Z",
        value: 93.3
      };
      pMock.vitals.lengthData[18] = {
        agemos: 24.9644041218638,
        display: "2008-12-20T03:31:00.000Z",
        value: 85.5
      };
      pMock.vitals.lengthData[19] = {
        agemos: 11.97983870967742,
        display: "2007-11-20T15:00:00.000Z",
        value: 73.5
      };


      pMock.vitals.weightData[0] = {
        agemos: 111.10931899641577,
        display: "2016-02-24T15:20:00.000Z",
        value: 39
      };
      pMock.vitals.weightData[1] = {
        agemos: 108.43187724014336,
        display: "2015-12-03T15:19:00.000Z",
        value: 38.7
      };
      pMock.vitals.weightData[2] = {
        agemos: 108.43183243727599,
        display: "2015-12-03T15:17:00.000Z",
        value: 38.7
      };
      pMock.vitals.weightData[3] = {
        agemos: 104.81883960573477,
        display: "2015-08-15T14:13:00.000Z",
        value: 38
      };
      pMock.vitals.weightData[4] = {
        agemos: 101.91556899641577,
        display: "2015-05-18T14:11:00.000Z",
        value: 37.2
      };
      pMock.vitals.weightData[5] = {
        agemos: 100.43145161290323,
        display: "2015-04-03T14:00:00.000Z",
        value: 36.5
      };
      pMock.vitals.weightData[6] = {
        agemos: 99.20582437275985,
        display: "2015-02-27T15:08:00.000Z",
        value: 36.5
      };
      pMock.vitals.weightData[7] = {
        agemos: 97.49731182795699,
        display: "2015-01-05T16:00:00.000Z",
        value: 34
      };
      pMock.vitals.weightData[8] = {
        agemos: 94.56720430107526,
        display: "2014-10-07T19:00:00.000Z",
        value: 32.2
      };
      pMock.vitals.weightData[9] = {
        agemos: 91.36693548387098,
        display: "2014-07-01T14:00:00.000Z",
        value: 30.1
      };
      pMock.vitals.weightData[10] = {
        agemos: 88.46639784946237,
        display: "2014-04-04T16:00:00.000Z",
        value: 28
      };
      pMock.vitals.weightData[11] = {
        agemos: 85.52956989247312,
        display: "2014-01-06T16:00:00.000Z",
        value: 26.6
      };
      pMock.vitals.weightData[12] = {
        agemos: 82.43817204301075,
        display: "2013-10-03T19:00:00.000Z",
        value: 24.8
      };
      pMock.vitals.weightData[13] = {
        agemos: 79.59408602150538,
        display: "2013-07-08T15:00:00.000Z",
        value: 23.1
      };
      pMock.vitals.weightData[14] = {
        agemos: 76.47043010752688,
        display: "2013-04-04T19:00:00.000Z",
        value: 22
      };
      pMock.vitals.weightData[15] = {
        agemos: 61.94758064516129,
        display: "2012-01-19T15:00:00.000Z",
        value: 19.5
      };
      pMock.vitals.weightData[16] = {
        agemos: 49.97983870967742,
        display: "2011-01-20T15:00:00.000Z",
        value: 16
      };
      pMock.vitals.weightData[17] = {
        agemos: 37.23790322580645,
        display: "2009-12-28T15:00:00.000Z",
        value: 14
      };
      pMock.vitals.weightData[18] = {
        agemos: 24.9644041218638,
        display: "2008-12-20T03:31:00.000Z",
        value: 12.1
      };
      pMock.vitals.weightData[19] = {
        agemos: 11.97983870967742,
        display: "2007-11-20T15:00:00.000Z",
        value: 9.5
      };

      p.boneAge = pMock.boneAge;
      p.demographics = pMock.demographics;
      p.vitals = pMock.vitals;

      window.data = p;
      console.log("Check out the patient's growth data: window.data");
      dfd.resolve(p);
    //}
  //}

  return dfd.promise();
};
