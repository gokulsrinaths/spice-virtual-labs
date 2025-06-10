export interface SubTopic {
  id: string;
  title: string;
  description: string;
}

export interface Experiment {
  id: string;
  title: string;
  description: string;
  icon: any;
  subTopics?: SubTopic[];
}