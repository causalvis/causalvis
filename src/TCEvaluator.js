import React, {useState, useEffect} from 'react';

import { SMDVis } from './SMDVis';
import { BalanceVis } from './BalanceVis';

export const TCEvaluator = ({dataset={}, TCDataset={}, SMDDataset=[], treatment="treatment"}) => {

  // Treatment and control datasets
  const [TDataset, setTDataset] = React.useState([]);
  const [CDataset, setCDataset] = React.useState([]);

  // Track the covariates that are controlled for
  const [covariates, setCovariates] = React.useState([]);

  useEffect(() => {

    let newTDataset = TCDataset.filter(d => d[treatment] === 1);
    let newCDataset = TCDataset.filter(d => d[treatment] === 0);

    setTDataset(newTDataset);
    setCDataset(newCDataset);

    let newCovariates = Object.keys(TCDataset[0]);
    newCovariates = newCovariates.filter(c => c != treatment);

    setCovariates(newCovariates);

  }, [TCDataset])

  return (
    <div>
      <SMDVis SMDDataset={SMDDataset.sort((a, b) => a.unweighted > b.unweighted)} />
      <BalanceVis TDataset={TDataset} CDataset={CDataset} attribute="age" />
    </div>
  )
}