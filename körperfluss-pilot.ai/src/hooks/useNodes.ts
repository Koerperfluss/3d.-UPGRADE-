import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase';
import { FundingNode } from '../../types';
import { nodesData } from '../../data';
import { useAuth } from '../../AuthContext';

export const useNodes = () => {
  const [nodes, setNodes] = useState<FundingNode[]>(nodesData);

  useEffect(() => {
    const nodesRef = collection(db, 'nodes');
    
    const populateNodes = async () => {
      try {
        const snapshot = await getDocs(nodesRef);
        if (snapshot.empty) {
          const batch = writeBatch(db);
          nodesData.forEach(node => {
            const docRef = doc(nodesRef, node.id);
            batch.set(docRef, { ...node });
          });
          await batch.commit();
        }
      } catch (error) {
        console.error("Error populating nodes:", error);
      }
    };
    
    populateNodes();
    
    const unsubscribe = onSnapshot(nodesRef, (snapshot) => {
      const fetchedNodes: FundingNode[] = [];
      snapshot.forEach(doc => fetchedNodes.push(doc.data() as FundingNode));
      if (fetchedNodes.length > 0) setNodes(fetchedNodes);
    }, (error) => console.error("Error fetching nodes:", error));
    
    return () => unsubscribe();
  }, []);

  return { nodes, setNodes };
};
