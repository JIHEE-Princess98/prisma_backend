import {
  createCustService,
  findByIdCustService,
  updateCustService,
} from "../services/customerService";
import { resultFormat } from "../utils/requestUtil.js";
import * as customerModel from "../models/customerModel.js";

/***
 * NAME: "거래처 등록"
 * URL : /api/cust/insert
 */
export const createCustomer_Ctler = async (req, res, next) => {
  try {
    const newCust = await createCustService(req.body, req);
    res.status(201).json(
      resultFormat({
        title: "거래처 등록",
        success: true,
        message: "거래처 등록에 성공했습니다.",
        data: newCust,
      })
    );
  } catch (error) {
    res.status(400).json(
      resultFormat({
        title: "거래처 등록",
        success: false,
        message: `거래처 등록 실패 : ${error.message}`,
      })
    );
  }
};

/***
 * NAME: "거래처 조회"
 * URL : /api/cust/list
 */
export const findCustomer_Ctler = async (req, res) => {
  try {
    const customer = await customerModel.findCustomer();
    res.status(201).json(
      resultFormat({
        title: "거래처 조회",
        success: true,
        message: "거래처 조회에 성공했습니다.",
        data: customer,
      })
    );
  } catch (error) {
    res.status(400).json(
      resultFormat({
        title: "거래처 조회",
        success: false,
        message: `거래처 조회 실패 : ${error.message}`,
      })
    );
  }
};

/***
 * NAME: "거래처 상세조회"
 * URL : /api/cust/list/:CUST_CD
 */
export const findByIdCust_Ctler = async (req, res) => {
  const { CUST_CD } = req.params;

  try {
    const custDetail = await findByIdCustService(CUST_CD);
    res.status(201).json(
      resultFormat({
        title: "거래처 조회",
        success: true,
        message: "거래처 조회에 성공했습니다.",
        data: custDetail,
      })
    );
  } catch (error) {
    res.status(400).json(
      resultFormat({
        title: "거래처 상세조회",
        success: false,
        message: `거래처 상세조회 실패 : ${error.message}`,
      })
    );
  }
};

/***
 * NAME: "거래처 수정"
 * URL : /api/cust/update/:CUST_CD
 */
export const updateCust_Ctler = async (req, res) => {
  const { CUST_CD } = req.params;
  const updateData = req.body;

  try {
    const updatedCust = await updateCustService(CUST_CD, updateData);
    res.status(201).json(
      resultFormat({
        title: "거래처 수정",
        success: true,
        message: "거래처 수정에 성공했습니다.",
        data: updatedCust,
      })
    );
  } catch (error) {
    res.status(400).json(
      resultFormat({
        title: "거래처 수정",
        success: false,
        message: `거래처 수정 실패 : ${error.message}`,
      })
    );
  }
};
