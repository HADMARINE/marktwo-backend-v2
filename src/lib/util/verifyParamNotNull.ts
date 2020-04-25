import throwError from '../throwError';

export default function verifyParamNotNull(param: Array<any>) {
  param.map(data => {
    if (!data) {
      return throwError('필수 항목이 입력되지 않았습니다.', 400);
    }
  });
}
