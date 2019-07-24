import DiscountList = app.shared.models.DiscountList;

export interface MyCards {
  status:  string;
  message: string;
  data:    Data;
}

export interface Data {
  actionStatus: string;
  cardNos:      CardNo[];
  getNoOfCard:  number;
  msgToDisplay: string;
  systemMesg:   string;
}

export interface CardNo {
  cardindex:    string;
  cardNo:       string;
  bankName:     string;
  friendlyName: string;
  type:         string;
  cvv?:         string;
  selected?:    boolean;
  deleted?:    boolean;
  emiBankID?: string;
  emiTenure?: string;
  emi?: boolean;
  withoutOTP?: string;
  offer?: DiscountList;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export namespace Convert {
  export function toMyCards(json: string): MyCards {
    return cast(JSON.parse(json), r('MyCards'));
  }

  export function myCardsToJson(value: MyCards): string {
    return JSON.stringify(uncast(value, r('MyCards')), null, 2);
  }

  function invalidValue(typ: any, val: any): never {
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`);
  }

  function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
      const map: any = {};
      typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
      typ.jsonToJS = map;
    }
    return typ.jsonToJS;
  }

  function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
      const map: any = {};
      typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
      typ.jsToJSON = map;
    }
    return typ.jsToJSON;
  }

  function transform(val: any, typ: any, getProps: any): any {
    function transformPrimitive(typ: string, val: any): any {
      if (typeof typ === typeof val) return val;
      return invalidValue(typ, val);
    }

    function transformUnion(typs: any[], val: any): any {
      // val must validate against one typ in typs
      const l = typs.length;
      for (let i = 0; i < l; i++) {
        const typ = typs[i];
        try {
          return transform(val, typ, getProps);
        } catch (_) {}
      }
      return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
      if (cases.indexOf(val) !== -1) return val;
      return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
      // val must be an array with no invalid elements
      if (!Array.isArray(val)) return invalidValue('array', val);
      return val.map(el => transform(el, typ, getProps));
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
      if (val === null || typeof val !== 'object' || Array.isArray(val)) {
        return invalidValue('object', val);
      }
      const result: any = {};
      Object.getOwnPropertyNames(props).forEach(key => {
        const prop = props[key];
        const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
        result[prop.key] = transform(v, prop.typ, getProps);
      });
      Object.getOwnPropertyNames(val).forEach(key => {
        if (!Object.prototype.hasOwnProperty.call(props, key)) {
          result[key] = transform(val[key], additional, getProps);
        }
      });
      return result;
    }

    if (typ === 'any') return val;
    if (typ === null) {
      if (val === null) return val;
      return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === 'object' && typ.ref !== undefined) {
      typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === 'object') {
      return typ.hasOwnProperty('unionMembers') ? transformUnion(typ.unionMembers, val)
        : typ.hasOwnProperty('arrayItems')    ? transformArray(typ.arrayItems, val)
          : typ.hasOwnProperty('props')         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    return transformPrimitive(typ, val);
  }

  function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
  }

  function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
  }

  function a(typ: any) {
    return { arrayItems: typ };
  }

  function u(...typs: any[]) {
    return { unionMembers: typs };
  }

  function o(props: any[], additional: any) {
    return { props, additional };
  }

  function m(additional: any) {
    return { props: [], additional };
  }

  function r(name: string) {
    return { ref: name };
  }

  const typeMap: any = {
    'MyCards': o([
      { json: 'status', js: 'status', typ: '' },
      { json: 'message', js: 'message', typ: '' },
      { json: 'data', js: 'data', typ: r('Data') },
    ], false),
    'Data': o([
      { json: 'actionStatus', js: 'actionStatus', typ: '' },
      { json: 'cardNos', js: 'cardNos', typ: a(r('CardNo')) },
      { json: 'getNoOfCard', js: 'getNoOfCard', typ: 0 },
      { json: 'msgToDisplay', js: 'msgToDisplay', typ: '' },
      { json: 'systemMesg', js: 'systemMesg', typ: '' },
    ], false),
    'CardNo': o([
      { json: 'cardindex', js: 'cardindex', typ: '' },
      { json: 'cardNo', js: 'cardNo', typ: '' },
      { json: 'bankName', js: 'bankName', typ: '' },
      { json: 'friendlyName', js: 'friendlyName', typ: '' },
      { json: 'type', js: 'type', typ: '' },
      { json: 'withoutOTP', js: 'withoutOTP', typ: '' },
    ], false),
  };
}
