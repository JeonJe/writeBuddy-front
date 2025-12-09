import { CorrectionService } from '../correctionService';
import { ApiClient } from '../../utils/apiClient';
import { Correction, CreateCorrectionRequest } from '../../types';

describe('CorrectionService', () => {
  let correctionService: CorrectionService;
  let mockApiClient: jest.Mocked<ApiClient>;

  beforeEach(() => {
    mockApiClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      setTokenRefreshCallback: jest.fn(),
    } as unknown as jest.Mocked<ApiClient>;

    correctionService = new CorrectionService(mockApiClient);
  });

  describe('createCorrection', () => {
    it('should call apiClient.post with correct endpoint and request', async () => {
      const request: CreateCorrectionRequest = {
        originSentence: 'Test sentence',
      };

      const mockCorrection: Correction = {
        id: 1,
        originSentence: 'Test sentence',
        correctedSentence: 'Corrected sentence',
        explanation: 'Test explanation',
        score: 8,
        isFavorite: false,
        memo: null,
        realExamples: [],
        createdAt: '2024-01-01T00:00:00Z',
      };

      mockApiClient.post.mockResolvedValue(mockCorrection);

      const result = await correctionService.createCorrection(request);

      expect(mockApiClient.post).toHaveBeenCalledWith('/corrections', request);
      expect(result).toEqual(mockCorrection);
    });
  });

  describe('getAllCorrections', () => {
    it('should call apiClient.get with corrections endpoint', async () => {
      const mockCorrections: Correction[] = [
        {
          id: 1,
          originSentence: 'Test 1',
          correctedSentence: 'Corrected 1',
          explanation: 'Explanation 1',
          score: 8,
          isFavorite: false,
          memo: null,
          realExamples: [],
          createdAt: '2024-01-01T00:00:00Z',
        },
      ];

      mockApiClient.get.mockResolvedValue(mockCorrections);

      const result = await correctionService.getAllCorrections();

      expect(mockApiClient.get).toHaveBeenCalledWith('/corrections');
      expect(result).toEqual(mockCorrections);
    });
  });

  describe('toggleFavorite', () => {
    it('should call apiClient.put with favorite endpoint', async () => {
      mockApiClient.put.mockResolvedValue(undefined);

      await correctionService.toggleFavorite(1);

      expect(mockApiClient.put).toHaveBeenCalledWith('/corrections/1/favorite');
    });
  });

  describe('updateMemo', () => {
    it('should call apiClient.put with memo endpoint and data', async () => {
      mockApiClient.put.mockResolvedValue(undefined);

      await correctionService.updateMemo(1, 'Test memo');

      expect(mockApiClient.put).toHaveBeenCalledWith('/corrections/1/memo', {
        memo: 'Test memo',
      });
    });
  });

  describe('getFavorites', () => {
    it('should call apiClient.get with favorites endpoint', async () => {
      const mockFavorites: Correction[] = [];
      mockApiClient.get.mockResolvedValue(mockFavorites);

      const result = await correctionService.getFavorites();

      expect(mockApiClient.get).toHaveBeenCalledWith('/corrections/favorites');
      expect(result).toEqual(mockFavorites);
    });
  });

  describe('getUserGoodExpressions', () => {
    it('should call apiClient.get with user good expressions endpoint', async () => {
      const mockExpressions: Correction[] = [];
      mockApiClient.get.mockResolvedValue(mockExpressions);

      const result = await correctionService.getUserGoodExpressions(123);

      expect(mockApiClient.get).toHaveBeenCalledWith('/corrections/users/123/good-expressions');
      expect(result).toEqual(mockExpressions);
    });
  });
});
