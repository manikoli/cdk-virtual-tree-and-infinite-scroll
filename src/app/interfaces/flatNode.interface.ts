export interface FlatNode {
  uid: string | null;
  name: string;
  createDateTimeUTC: string;
  lastModifiedByMe: string;
  lastModifiedByOthers: string;
  parentNodeUid: string | null;
  color: string;
  icon: string;
  nodeType: 'Folder' | 'Document';
  ownerUid: string;
  level: string;
}
