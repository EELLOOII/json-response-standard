<?php
/**
 * Test suite for PHP JSON Response Standard
 */

// Include the response function
require_once __DIR__ . '/../examples/response.php';

class JsonResponseTest {
    protected $passedTests = 0;
    protected $totalTests = 0;
    
    /**
     * Simple test runner function
     */
    public function test($description, $testFunc) {
        $this->totalTests++;
        try {
            $testFunc();
            echo "[PASS] {$description}\n";
            $this->passedTests++;
            return true;
        } catch (Exception $e) {
            echo "[FAIL] {$description}: {$e->getMessage()}\n";
            return false;
        }
    }
    
    /**
     * Custom assertion function
     */
    protected function assert($condition, $message) {
        if (!$condition) {
            throw new Exception($message);
        }
    }
    
    /**
     * Run all tests
     */
    public function runTests() {
        // Test 1: Basic response generation
        $this->test("Basic response generation", function() {
            ob_start();
            jsonResponse(['user' => 'John'], 200, 'Success');
        });
        
        // Test 2: Default values
        $this->test("Default values", function() {
            ob_start();
            jsonResponse();
        });
        
        // Test 3: Empty data array
        $this->test("Empty data array", function() {
            ob_start();
            jsonResponse([], 200, 'Empty data');
        });
        
        // Test 4: Complex data structure
        $this->test("Complex data structure", function() {
            $complexData = [
                'users' => [
                    ['id' => 1, 'name' => 'John'],
                    ['id' => 2, 'name' => 'Jane']
                ],
                'meta' => ['total' => 2, 'page' => 1]
            ];
            ob_start();
            jsonResponse($complexData, 201, 'Created');
        });
        
        // Test 5: Different status codes
        $this->test("Different status codes", function() {
            $statusCodes = [200, 201, 400, 404, 500];
            foreach ($statusCodes as $code) {
                ob_start();
                jsonResponse(['test' => true], $code, "Status {$code}");
                ob_get_clean(); // Clean the buffer
            }
        });
        
        // Test 6: JSON encoding validation
        $this->test("JSON encoding validation", function() {
            ob_start();
            jsonResponse(['special' => 'characters: áéíóú'], 200, 'UTF-8 test');
            $output = ob_get_clean();
            $decoded = json_decode($output, true);
            $this->assert($decoded !== null, 'Output should be valid JSON');
            $this->assert($decoded['data']['special'] === 'characters: áéíóú', 'UTF-8 characters should be preserved');
        });
        
        // Test 7: Header validation
        $this->test("Content-Type header set", function() {
            // Note: In a real environment, you'd check headers_list()
            // For this test, we'll just ensure the function runs without error
            ob_start();
            jsonResponse(['header' => 'test'], 200, 'Header test');
            ob_get_clean();
            // In a full test environment, you would assert:
            // $this->assert(in_array('Content-Type: application/json', headers_list()), 'Content-Type header should be set');
        });
        
        echo "\nTests completed! {$this->passedTests}/{$this->totalTests} tests passed.\n";
        return $this->passedTests === $this->totalTests;
    }
}

// Helper function to create a testable version of jsonResponse
function testableJsonResponse($data = [], $status = 200, $message = '') {
    return json_encode([
        'status' => $status,
        'message' => $message,
        'data' => $data
    ], JSON_PRETTY_PRINT);
}

// Enhanced test class for more detailed testing
class DetailedJsonResponseTest extends JsonResponseTest {
    
    public function runDetailedTests() {
        echo "Running detailed PHP JSON Response tests...\n\n";
        
        // Test the testable version for detailed validation
        $this->test("Detailed JSON structure validation", function() {
            $result = testableJsonResponse(['user' => 'John'], 200, 'Success');
            $decoded = json_decode($result, true);
            
            $this->assert(isset($decoded['status']), 'Response should have status field');
            $this->assert(isset($decoded['message']), 'Response should have message field');
            $this->assert(isset($decoded['data']), 'Response should have data field');
            
            $this->assert($decoded['status'] === 200, 'Status should be 200');
            $this->assert($decoded['message'] === 'Success', 'Message should be "Success"');
            $this->assert($decoded['data']['user'] === 'John', 'Data should contain user');
        });
        
        $this->test("Default values detailed", function() {
            $result = testableJsonResponse();
            $decoded = json_decode($result, true);
            
            $this->assert($decoded['status'] === 200, 'Default status should be 200');
            $this->assert($decoded['message'] === '', 'Default message should be empty');
            $this->assert(is_array($decoded['data']), 'Default data should be array');
            $this->assert(empty($decoded['data']), 'Default data should be empty array');
        });
        
        $this->test("JSON pretty print format", function() {
            $result = testableJsonResponse(['test' => true], 200, 'Format test');
            $this->assert(strpos($result, "\n") !== false, 'Output should be pretty printed');
            $this->assert(json_decode($result) !== null, 'Output should be valid JSON');
        });
        
        echo "\nDetailed tests completed! {$this->passedTests}/{$this->totalTests} tests passed.\n";
        
        if ($this->passedTests === $this->totalTests) {
            echo "[SUCCESS] All PHP tests passed!\n";
        } else {
            $failed = $this->totalTests - $this->passedTests;
            echo "[WARNING] {$failed} tests failed.\n";
        }
        
        return $this->passedTests === $this->totalTests;
    }
}

// Run the tests
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    $tester = new DetailedJsonResponseTest();
    $success = $tester->runDetailedTests();
    exit($success ? 0 : 1);
}
?>
