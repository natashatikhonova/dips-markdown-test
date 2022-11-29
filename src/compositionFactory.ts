import { v4 as uuidv4 } from 'uuid';

export default class CompositionFactory {
  getEhrNotesDocument(headings, type) {

    let composition =  `
    {
      "_type": "COMPOSITION",
      "archetype_node_id": "openEHR-EHR-COMPOSITION.report.v1",
      "name": {
        "value": "${type}"
      },
      "uid": {
        "_type": "OBJECT_VERSION_ID",
        "value": "${uuidv4()}::ehr-notes::1"
      },
      "archetype_details": {
        "archetype_id": {
          "value": "openEHR-EHR-COMPOSITION.report.v1"
        },
        "template_id": {
          "value": "epikrise_dips_semistrukturert_01"
        },
        "rm_version": "1.0.4"
      },
      "language": {
        "terminology_id": {
          "value": "openehr"
        },
        "code_string": "nb"
      },
      "territory": {
        "terminology_id": {
          "value": "openehr"
        },
        "code_string": "NO"
      },
      "category": {
        "defining_code": {
          "terminology_id": {
            "value": "openehr"
          },
          "code_string": "433"
        }
      },
      "composer": {
        "_type": "PARTY_IDENTIFIED",
        "name": "unknown"
      },
      "context": {
        "start_time": {
          "value": "${new Date().toISOString()}"
        },
        "setting": {
          "value": "secondary medical care",
          "defining_code": {
            "terminology_id": {
              "value": "openehr"
            },
            "code_string": "232"
          }
        },
        "other_context": {
          "_type": "ITEM_TREE",
          "archetype_node_id": "at0001",
          "name": {
            "value": "Tree"
          }
        }
      }, "content": [`;

    for (let i = 0; i < headings.length; i++){
      composition += `{
        "_type": "EVALUATION",
        "archetype_node_id": "openEHR-EHR-EVALUATION.clinical_synopsis.v1",
        "name": {
          "value": "${headings[i][0]}"
        },
        "archetype_details": {
          "archetype_id": {
            "value": "openEHR-EHR-EVALUATION.clinical_synopsis.v1"
          },
          "template_id": {
            "value": "epikrise_dips_semistrukturert_01"
          },
          "rm_version": "1.0.4"
        },
        "language": {
          "terminology_id": {
            "value": "ISO_639-1"
          },
          "code_string": "nb"
        },
        "encoding": {
          "terminology_id": {
            "value": "IANA"
          },
          "code_string": "UTF-8"
        },
        "subject": {
          "_type": "PARTY_SELF"
        },
        "protocol": {
          "_type": "ITEM_TREE",
          "archetype_node_id": "at0003",
          "name": {
            "value": "Tree"
          },
          "items": [
            {
              "_type": "CLUSTER",
              "archetype_node_id": "openEHR-EHR-CLUSTER.epicrisis_result_metadata_dips.v1",
              "name": {
                "value": "Metadata om epikrise"
              },
              "archetype_details": {
                "archetype_id": {
                  "value": "openEHR-EHR-CLUSTER.epicrisis_result_metadata_dips.v1"
                },
                "template_id": {
                  "value": "epikrise_dips_semistrukturert_01"
                },
                "rm_version": "1.0.4"
              },
              "items": [
                {
                  "_type": "ELEMENT",
                  "archetype_node_id": "at0001",
                  "name": {
                    "value": "Type tekstsvar"
                  },
                  "value": {
                    "_type": "DV_CODED_TEXT",
                    "value": "${headings[i][0]}",
                    "defining_code": {
                      "terminology_id": {
                        "value": "local"
                      },
                      "code_string": "at0016"
                    }
                  }
                }
              ]
            }
          ]
        },
        "data": {
          "_type": "ITEM_TREE",
          "archetype_node_id": "at0001",
          "name": {
            "value": "List"
          },
          "items": [
            {
              "_type": "ELEMENT",
              "archetype_node_id": "at0002",
              "name": {
                "value": "Sammendrag"
              },
              "value": {
                "_type": "DV_TEXT",
                "value": "${headings[i][1]}"
              }
            }
          ]
        }
      } `

      if (i != headings.length-1) composition += `,`
    }
    
    composition += `]}`;
    return composition;
  }
}