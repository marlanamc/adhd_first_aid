"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var supabase_js_1 = require("@supabase/supabase-js");
var csv_parse_1 = require("csv-parse");
var fs_1 = require("fs");
var path_1 = require("path");
var url_1 = require("url");
var dotenv = require("dotenv");
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = path_1.default.dirname(__filename);
// Load environment variables from .env.local
dotenv.config({ path: path_1.default.join(__dirname, '..', '.env.local') });
// Supabase setup
var supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
var supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables:', {
        url: supabaseUrl ? 'present' : 'missing',
        key: supabaseKey ? 'present' : 'missing'
    });
    process.exit(1);
}
console.log('Supabase URL:', supabaseUrl);
var supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
// Add getOrInsertId here
function getOrInsertId(table, name) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error, _b, insertData, insertError;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, supabase
                        .from(table)
                        .select('id')
                        .eq('name', name)
                        .single()];
                case 1:
                    _a = _c.sent(), data = _a.data, error = _a.error;
                    if (error && error.code !== 'PGRST116') {
                        throw new Error("Error checking ".concat(table, " for \"").concat(name, "\": ").concat(error.message));
                    }
                    if (data)
                        return [2 /*return*/, data.id
                            // If not found, insert it
                        ];
                    return [4 /*yield*/, supabase
                            .from(table)
                            .insert({ name: name })
                            .select()
                            .single()];
                case 2:
                    _b = _c.sent(), insertData = _b.data, insertError = _b.error;
                    if (insertError || !insertData) {
                        throw new Error("Error inserting into ".concat(table, ": ").concat(insertError === null || insertError === void 0 ? void 0 : insertError.message));
                    }
                    return [2 /*return*/, insertData.id];
            }
        });
    });
}
// Helper function to parse array fields
function parseArrayField(field) {
    if (!field)
        return [];
    // If the field is already in array format (starts with [ and ends with ])
    if (field.startsWith('[') && field.endsWith(']')) {
        try {
            return JSON.parse(field);
        }
        catch (e) {
            console.warn('Failed to parse array field:', field);
            return [];
        }
    }
    // Otherwise split by comma and clean up
    return field.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
}
// Transform CSV record into database format
function transformRecord(record) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return {
        core: {
            name: ((_a = record['name']) === null || _a === void 0 ? void 0 : _a.trim()) || '',
            description: ((_b = record['description']) === null || _b === void 0 ? void 0 : _b.trim()) || '',
            source: ((_c = record['source']) === null || _c === void 0 ? void 0 : _c.trim()) || null,
            price: ((_d = record['price']) === null || _d === void 0 ? void 0 : _d.trim()) || null,
            tags: parseArrayField(record['tags']),
            use_case: ((_e = record['use_case']) === null || _e === void 0 ? void 0 : _e.trim()) || null,
            adhd_friendly_improvement: ((_f = record['adhd_friendly_improvement']) === null || _f === void 0 ? void 0 : _f.trim()) || null,
            example: ((_g = record['example']) === null || _g === void 0 ? void 0 : _g.trim()) || null,
            featured: ((_h = record['featured']) === null || _h === void 0 ? void 0 : _h.toLowerCase()) === 'true',
            votes: parseInt(record['votes']) || 0,
        },
        feelings: parseArrayField(record['feeling']),
        issues: parseArrayField(record['issue']),
        barriers: parseArrayField(record['barrier_type'])
    };
}
function importData() {
    return __awaiter(this, void 0, void 0, function () {
        var csvFilePath, fileContent, parser, records, _a, parser_1, parser_1_1, record, e_1_1, deleteError, _i, records_1, record, core, feelings, issues, barriers, _b, strategyData, insertError, strategyId, _c, feelings_1, f, fId, _d, issues_1, i, iId, _e, barriers_1, b, bId, error_1;
        var _f, e_1, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    _j.trys.push([0, 35, , 36]);
                    csvFilePath = path_1.default.join(__dirname, '..', 'sample.csv');
                    fileContent = fs_1.default.readFileSync(csvFilePath, 'utf-8');
                    console.log('Reading CSV file...');
                    parser = (0, csv_parse_1.parse)(fileContent, {
                        columns: function (headers) {
                            console.log('CSV Headers:', headers);
                            return headers.map(function (h) { return h.trim(); });
                        },
                        skip_empty_lines: true,
                        trim: true
                    });
                    records = [];
                    _j.label = 1;
                case 1:
                    _j.trys.push([1, 6, 7, 12]);
                    _a = true, parser_1 = __asyncValues(parser);
                    _j.label = 2;
                case 2: return [4 /*yield*/, parser_1.next()];
                case 3:
                    if (!(parser_1_1 = _j.sent(), _f = parser_1_1.done, !_f)) return [3 /*break*/, 5];
                    _h = parser_1_1.value;
                    _a = false;
                    record = _h;
                    records.push(transformRecord(record));
                    _j.label = 4;
                case 4:
                    _a = true;
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_1_1 = _j.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _j.trys.push([7, , 10, 11]);
                    if (!(!_a && !_f && (_g = parser_1.return))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _g.call(parser_1)];
                case 8:
                    _j.sent();
                    _j.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12:
                    console.log("Parsed ".concat(records.length, " records from CSV"));
                    // Clear existing data
                    console.log('Clearing existing data...');
                    return [4 /*yield*/, supabase.from('strategy_feelings').delete().neq('strategy_id', 0)];
                case 13:
                    _j.sent();
                    return [4 /*yield*/, supabase.from('strategy_issues').delete().neq('strategy_id', 0)];
                case 14:
                    _j.sent();
                    return [4 /*yield*/, supabase.from('strategy_barriers').delete().neq('strategy_id', 0)];
                case 15:
                    _j.sent();
                    return [4 /*yield*/, supabase
                            .from('strategies')
                            .delete()
                            .neq('id', 0)]; // Delete all records
                case 16:
                    deleteError = (_j.sent()) // Delete all records
                    .error;
                    if (deleteError) {
                        throw new Error("Failed to clear existing data: ".concat(deleteError.message));
                    }
                    console.log('Inserting new data...');
                    _i = 0, records_1 = records;
                    _j.label = 17;
                case 17:
                    if (!(_i < records_1.length)) return [3 /*break*/, 34];
                    record = records_1[_i];
                    core = record.core, feelings = record.feelings, issues = record.issues, barriers = record.barriers;
                    return [4 /*yield*/, supabase
                            .from('strategies')
                            .insert(core)
                            .select()
                            .single()];
                case 18:
                    _b = _j.sent(), strategyData = _b.data, insertError = _b.error;
                    if (insertError || !strategyData) {
                        console.error('Failed to insert strategy:', core.name);
                        return [3 /*break*/, 33];
                    }
                    strategyId = strategyData.id;
                    _c = 0, feelings_1 = feelings;
                    _j.label = 19;
                case 19:
                    if (!(_c < feelings_1.length)) return [3 /*break*/, 23];
                    f = feelings_1[_c];
                    return [4 /*yield*/, getOrInsertId('feelings', f)];
                case 20:
                    fId = _j.sent();
                    return [4 /*yield*/, supabase.from('strategy_feelings').insert({ strategy_id: strategyId, feeling_id: fId })];
                case 21:
                    _j.sent();
                    _j.label = 22;
                case 22:
                    _c++;
                    return [3 /*break*/, 19];
                case 23:
                    _d = 0, issues_1 = issues;
                    _j.label = 24;
                case 24:
                    if (!(_d < issues_1.length)) return [3 /*break*/, 28];
                    i = issues_1[_d];
                    return [4 /*yield*/, getOrInsertId('issues', i)];
                case 25:
                    iId = _j.sent();
                    return [4 /*yield*/, supabase.from('strategy_issues').insert({ strategy_id: strategyId, issue_id: iId })];
                case 26:
                    _j.sent();
                    _j.label = 27;
                case 27:
                    _d++;
                    return [3 /*break*/, 24];
                case 28:
                    _e = 0, barriers_1 = barriers;
                    _j.label = 29;
                case 29:
                    if (!(_e < barriers_1.length)) return [3 /*break*/, 33];
                    b = barriers_1[_e];
                    return [4 /*yield*/, getOrInsertId('barriers', b)];
                case 30:
                    bId = _j.sent();
                    return [4 /*yield*/, supabase.from('strategy_barriers').insert({ strategy_id: strategyId, barrier_id: bId })];
                case 31:
                    _j.sent();
                    _j.label = 32;
                case 32:
                    _e++;
                    return [3 /*break*/, 29];
                case 33:
                    _i++;
                    return [3 /*break*/, 17];
                case 34:
                    console.log('🎉 All strategies imported successfully');
                    console.log("Successfully imported ".concat(records.length, " strategies"));
                    console.log('First record:', records[0]);
                    return [3 /*break*/, 36];
                case 35:
                    error_1 = _j.sent();
                    console.error('Import failed:', error_1);
                    process.exit(1);
                    return [3 /*break*/, 36];
                case 36: return [2 /*return*/];
            }
        });
    });
}
// Run the import
importData();
