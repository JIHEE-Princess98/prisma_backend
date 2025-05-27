import * as customerModel from "../models/customerModel";

/**
 * 거래처 생성
 */
export const createCustService = async (data) => {
  const { CUST_CD } = data;

  const existing = await customerModel.findCustByCode(CUST_CD);
  if (existing) {
    throw new Error("이미 존재하는 거래처 코드입니다.");
  }

  return await customerModel.createCustomer(data);
};

/**
 * 거래처 상세 정보
 */
export const findByIdCustService = async (CUST_CD) => {
  const cust = await customerModel.findCustByCode(CUST_CD);
  if (!cust) {
    const error = new Error("해당 거래처를 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }
  return cust;
};

/**
 * 거래처 정보 수정
 */
export const updateCustService = async (CUST_CD, updateData) => {
  const existing = await customerModel.findCustByCode(CUST_CD);
  if (!existing) {
    const error = new Error("존재하지 않는 거래처입니다.");
    error.status = 404;
    throw error;
  }
  return await customerModel.updateCustomer(CUST_CD, updateData);
};
