import { PointPredicateBaseConfiguration } from "model/point/configuration/base/pointPredicateBaseConfiguration";
import { RootPointPredicateConfiguration } from "model/point/configuration/root/rootPointPredicateConfiguration";
import { PointPredicateFailureResult } from "model/point/predicate/result/pointPredicateFailureResult";
import { PointPredicateSingleSuccessResult } from "model/point/predicate/result/pointPredicateSingleSuccessResult";
import { calculateChickenHandResultFromResults } from "service/point/predicate/impl/chicken/chickenHandPredicate";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";

describe('chickenHandPredicate.ts', () => {
    describe('calculateChickenHandResultFromResults', () => {
        test('input of empty results returns true', () => {
            const result = calculateChickenHandResultFromResults([], new RootPointPredicateConfiguration(12));
    
            expect(result.success).toBe(true);
        });

        test('input with successful result that is not a bonus and is enabled returns false', () => {
            const inputResults = [new PointPredicateSingleSuccessResult("custom_ppid")];
            const rootConfig = new RootPointPredicateConfiguration(12);
            rootConfig.pointPredicateIdToBaseConfiguration.set("custom_ppid", 
                new PointPredicateBaseConfiguration.Builder().enabled(true).isBonus(false).build());

            const result = calculateChickenHandResultFromResults(inputResults, rootConfig);
    
            expect(result.pointPredicateId).toBe(PointPredicateID.CHICKEN_HAND);
            expect(result.success).toBe(false);
        });

        test('input with unsuccessful result that is not a bonus and is enabled returns true', () => {
            const inputResults = [new PointPredicateFailureResult("custom_ppid")];
            const rootConfig = new RootPointPredicateConfiguration(12);
            rootConfig.pointPredicateIdToBaseConfiguration.set("custom_ppid", 
                new PointPredicateBaseConfiguration.Builder().enabled(true).isBonus(false).build());

            const result = calculateChickenHandResultFromResults(inputResults, rootConfig);
    
            expect(result.pointPredicateId).toBe(PointPredicateID.CHICKEN_HAND);
            expect(result.success).toBe(true);
        });

        test('input with successful result that is a bonus and is enabled returns true', () => {
            const inputResults = [new PointPredicateSingleSuccessResult("custom_ppid")];
            const rootConfig = new RootPointPredicateConfiguration(12);
            rootConfig.pointPredicateIdToBaseConfiguration.set("custom_ppid", 
                new PointPredicateBaseConfiguration.Builder().enabled(true).isBonus(true).build());

            const result = calculateChickenHandResultFromResults(inputResults, rootConfig);
    
            expect(result.pointPredicateId).toBe(PointPredicateID.CHICKEN_HAND);
            expect(result.success).toBe(true);
        });

        test('input with successful result that is a bonus but is not enabled returns true', () => {
            const inputResults = [new PointPredicateSingleSuccessResult("custom_ppid")];
            const rootConfig = new RootPointPredicateConfiguration(12);
            rootConfig.pointPredicateIdToBaseConfiguration.set("custom_ppid", 
                new PointPredicateBaseConfiguration.Builder().enabled(false).isBonus(true).build());

            const result = calculateChickenHandResultFromResults(inputResults, rootConfig);
    
            expect(result.pointPredicateId).toBe(PointPredicateID.CHICKEN_HAND);
            expect(result.success).toBe(true);
        });
    });
});