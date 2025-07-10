
import { UserAnswers, Product } from '../types';
import { PRODUCTS } from '../constants';

export const getRecommendation = (answers: UserAnswers): Product => {
    const scores: { [key: string]: number } = {
        aspect: 0,
        rightangle: 0,
        triplepoint: 0,
        openlink: 0,
        allegro: 0,
    };

    // Rule 1: Organization Size
    if (answers.orgSize === 'Small/Startup') {
        scores.aspect += 3;
    } else if (answers.orgSize === 'Medium') {
        scores.aspect += 1;
        scores.rightangle += 1;
        scores.allegro += 1;
    } else if (answers.orgSize === 'Enterprise') {
        scores.openlink += 3;
        scores.triplepoint += 2;
        scores.rightangle += 1;
    }

    // Rule 2: Industry
    if (answers.industry === 'Metals' || answers.industry === 'Agri-Commodities') {
        scores.aspect += 2;
    }
    if (answers.industry === 'Oil & Gas') {
        scores.rightangle += 2;
        scores.aspect += 1;
    }
    if (answers.industry === 'Power & Utilities') {
        scores.allegro += 3;
        scores.rightangle += 2;
    }
    if (answers.industry === 'Financial Services') {
        scores.openlink += 2;
    }
    if (answers.industry === 'Multi-Commodity') {
        scores.openlink += 2;
        scores.triplepoint += 1;
    }

    // Rule 3: Priorities
    answers.priorities.forEach(priority => {
        if (priority === 'Logistics') scores.rightangle += 2;
        if (priority === 'Risk') scores.triplepoint += 3;
        if (priority === 'ETRM Integration') scores.allegro += 2;
        if (priority === 'Regulatory Compliance' || priority === 'Accounting') {
            scores.openlink += 1;
            scores.triplepoint += 1;
        }
    });

    // Rule 4: Trading Type
    if (answers.tradingType === 'Physical') {
        scores.rightangle += 1;
        scores.allegro += 1;
    }
    if (answers.tradingType === 'Financial') {
        scores.openlink += 1;
        scores.triplepoint += 1;
    }

    // Rule 5: User Count (penalize small solutions for large user counts)
    if (answers.users > 100) {
        scores.aspect -= 1;
    }
    if (answers.users > 200) {
        scores.openlink += 1;
        scores.triplepoint += 1;
    }

    // Rule 6: Current System (if they have a complex system, they need a powerful replacement)
    if (answers.currentSystem === 'Other CTRM System' || answers.currentSystem === 'In-house Tool') {
        scores.openlink += 1;
        scores.triplepoint += 1;
        scores.rightangle += 1;
    }

    let topProduct = 'aspect';
    let maxScore = -1;

    for (const product in scores) {
        if (scores[product] > maxScore) {
            maxScore = scores[product];
            topProduct = product;
        }
    }

    const recommendedProduct = PRODUCTS.find(p => p.id === topProduct);
    return recommendedProduct || PRODUCTS[0]; // Fallback to Aspect
};
