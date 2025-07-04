import { IError } from "./error-interface";

export const PostNotFound: IError = {
  code: 'PNF-001',
  message: 'PostNotFound',
  shortMessage: 'PostNotFound',
}

export const PostIsNotFromAuthor: IError = {
  code: 'PNF-002',
  message: 'PostIsNotFromAuthor',
  shortMessage: 'PostIsNotFromAuthor',
}